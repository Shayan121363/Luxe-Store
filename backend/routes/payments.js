const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in cart' });

    // Validate products and stock
    const lineItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      subtotal += product.price * item.quantity;
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: product.images?.length ? [product.images[0]] : [],
            metadata: { productId: product._id.toString() },
          },
          unit_amount: Math.round(product.price * 100), // cents
        },
        quantity: item.quantity,
      });
    }

    const shippingCost = subtotal >= 50 ? 0 : 5.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + shippingCost + tax;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      customer_email: req.user.email,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU', 'PK'] },
      metadata: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items),
      },
      payment_intent_data: {
        metadata: { userId: req.user._id.toString() },
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/create-payment-intent (for custom checkout)
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { items } = req.body;

    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      total += product.price * item.quantity;
    }

    const shippingCost = total >= 50 ? 0 : 5.99;
    const tax = total * 0.08;
    const grandTotal = Math.round((total + shippingCost + tax) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: grandTotal,
      currency: 'usd',
      metadata: { userId: req.user._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/session/:sessionId
router.get('/session/:sessionId', protect, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ['payment_intent', 'line_items'],
    });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/webhook
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      await handleCheckoutComplete(session);
    } catch (err) {
      console.error('Error handling checkout:', err);
    }
  }

  res.json({ received: true });
});

async function handleCheckoutComplete(session) {
  const { userId, items: itemsJson, shippingAddress: addressJson } = session.metadata;
  const items = JSON.parse(itemsJson);
  const shippingAddress = addressJson ? JSON.parse(addressJson) : {};

  // Build order items and update stock
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      quantity: item.quantity,
    });

    subtotal += product.price * item.quantity;
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shippingCost + tax;

  const address = session.shipping_details?.address || {};

  await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress: {
      name: session.shipping_details?.name || shippingAddress.name || 'Customer',
      street: address.line1 || shippingAddress.street || '',
      city: address.city || shippingAddress.city || '',
      state: address.state || shippingAddress.state || '',
      zip: address.postal_code || shippingAddress.zip || '',
      country: address.country || shippingAddress.country || 'US',
    },
    paymentResult: {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      status: 'paid',
      paidAt: new Date(),
    },
    subtotal,
    shippingCost,
    tax,
    total,
    status: 'paid',
  });
}

module.exports = router;