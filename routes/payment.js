// routes/payment.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Endpoint to create a checkout session
router.post('/', async (req, res) => {
    const { deliveryCharge, cart } = req.body;
  
    // Input validation
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Invalid items array" });
    }
  
    try {
      const lineItems = cart.map((item) => {
        if (!item.productname || !item.cart_id || !item.id || !item.product_image || !item.category || !item.price) {
          throw new Error("Invalid item data. Each item must have 'productname', 'price', etc.");
        }
  
        return {
          price_data: {
            currency: 'USD',
            product_data: {
              name: item.productname,
            },
            unit_amount: Math.round(item.price * 100), // Stripe expects price in cents
          },
          quantity: 1,
        };
      });
  
      // Add a separate line item for the delivery charge
      lineItems.push({
        price_data: {
          currency: 'USD',
          product_data: {
            name: 'Delivery Charge',
          },
          unit_amount: Math.round(deliveryCharge * 100), // Convert delivery charge to cents
        },
        quantity: 1,
      });
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: 'https://bazar-bd.vercel.app/dashboard/success',
        cancel_url: `https://bazar-bd.vercel.app/dashboard/payment/cancel`,
      });
  
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error.message);
      res.status(500).json({ error: "An error occurred while creating the checkout session" });
    }
  });

module.exports = router;
