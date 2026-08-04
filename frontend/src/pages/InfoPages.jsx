import React from 'react';
import './InfoPages.css';

export const FAQPage = () => (
  <div className="container info-page">
    <h1>Frequently Asked Questions</h1>
    <div className="info-content">
      <h3>How do I track my order?</h3>
      <p>Once your order has shipped, you will receive an email with a tracking number.</p>
      <h3>What is your return policy?</h3>
      <p>We offer a 30-day return policy for all unused items in their original packaging.</p>
      <h3>Do you ship internationally?</h3>
      <p>Yes, we ship to most countries worldwide. Shipping costs will apply and be added at checkout.</p>
    </div>
  </div>
);

export const ShippingPage = () => (
  <div className="container info-page">
    <h1>Shipping Information</h1>
    <div className="info-content">
      <h3>Standard Shipping</h3>
      <p>Orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days.</p>
      <h3>Express Shipping</h3>
      <p>We offer 2-day and overnight shipping options at checkout for an additional fee.</p>
      <h3>Free Shipping</h3>
      <p>Enjoy free standard shipping on all orders over $50.</p>
    </div>
  </div>
);

export const ReturnsPage = () => (
  <div className="container info-page">
    <h1>Returns & Exchanges</h1>
    <div className="info-content">
      <p>If you're not completely satisfied with your purchase, you can return it within 30 days of receipt.</p>
      <h3>How to initiate a return</h3>
      <ol>
        <li>Contact our support team with your order number.</li>
        <li>We will provide a prepaid return shipping label.</li>
        <li>Pack the items securely and drop off at the designated carrier.</li>
      </ol>
      <p>Refunds will be processed to the original method of payment within 5-7 business days after we receive the return.</p>
    </div>
  </div>
);

export const ContactPage = () => (
  <div className="container info-page">
    <h1>Contact Us</h1>
    <div className="info-content">
      <p>We're here to help! Reach out to us through any of the channels below.</p>
      <div className="contact-details">
        <p><strong>Email:</strong> support@luxestore.com</p>
        <p><strong>Phone:</strong> 1-800-LUXE-STORE</p>
        <p><strong>Hours:</strong> Monday - Friday, 9am - 6pm EST</p>
      </div>
      <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
        <input type="text" placeholder="Your Name" required className="form-input" />
        <input type="email" placeholder="Your Email" required className="form-input" />
        <textarea placeholder="Your Message" required className="form-input" rows="5"></textarea>
        <button type="submit" className="btn btn-primary">Send Message</button>
      </form>
    </div>
  </div>
);
