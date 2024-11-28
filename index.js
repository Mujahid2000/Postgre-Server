const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.get('/', async (req, res) => {
  res.send(`running server ${port}`);
});

app.post('/jwt', async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
    res.send({ token });
  } catch (error) {
    console.log('Error generating token:', error);
    res.status(500).send({ error: true, message: 'Error generating token', error });
  }
});

// Token Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    next(); // Proceed to the next middleware
  });
};


// Verify Token Endpoint
app.post('/verify-token', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid', user: req.user });
});

// Protected route example
app.get('/protected-route', verifyToken, (req, res) => {
  res.json({ message: 'You are authorized!', user: req.user });
});

// Modular Route Imports
const productRoutes = require('./routes/ProductRoute');
const user_data_routes = require('./routes/UserDataRoute');
const discount = require('./routes/discount');
const cart = require('./routes/cart');
const wishlist = require('./routes/wishlist');
const payment = require('./routes/payment');
const order = require('./routes/orderData');
const shop = require('./routes/shop');

// Route Declarations
app.use('/product', productRoutes);
app.use('/user', user_data_routes);
app.use('/discount', discount);
app.use('/cart', verifyToken, cart);
app.use('/wishlist', verifyToken, wishlist);
app.use('/checkout', payment);
app.use('/order', order);
app.use('/shop', shop);

// Server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
