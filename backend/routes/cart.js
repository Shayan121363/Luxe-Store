const express = require('express');
const router = express.Router();

// Cart is managed client-side in localStorage for simplicity.
// This route provides product validation for cart items.

const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// POST /api/cart/validate - validate cart items before checkout
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const validatedItems = [];
    const errors = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        errors.push(`Product ${item.productId} not found`);
        continue;
      }
      if (product.stock < item.quantity) {
        errors.push(`Only ${product.stock} units of "${product.name}" available`);
      }
      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        stock: product.stock,
        quantity: item.quantity,
      });
    }

    if (errors.length > 0) return res.status(400).json({ message: errors.join(', '), errors });

    const subtotal = validatedItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = subtotal >= 50 ? 0 : 5.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + shippingCost + tax;

    res.json({ valid: true, items: validatedItems, subtotal, shippingCost, tax, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;