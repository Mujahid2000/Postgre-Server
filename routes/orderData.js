const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

router.post('/', async (req, res) => {
  const { cart, email, totalPrice, deliveryCharge, userId } = req.body;
  console.log(cart);
  const id = uuidv4(); // Generate a unique ID for the order
  try {
    // Inserting data into `order_data` table
    const result = await pool.query(
      'INSERT INTO order_data (id, email, total_price, delivery_charge, user_id, cart) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, email, totalPrice, deliveryCharge, userId, JSON.stringify(cart)]
    );

    res.status(201).json({ message: 'Data inserted successfully', data: result.rows[0] });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error inserting data" });
  }
});


router.get('/:email', async(req, res) =>{
  const email = req.params.email;
  try {
    const orderData = await pool.query(
      "SELECT * FROM order_data WHERE email = $1",
      [email]
    );
    res
      .status(200)
      .json({ message: "success get single data", data: orderData.rows });
  } catch (error) {
    
  }
})


router.get('/', async(req, res) =>{
  
  try {
    const orderData = await pool.query(
      "SELECT * FROM order_data",
      []
    );
    res
      .status(200)
      .json({ message: "success get single data", data: orderData.rows });
  } catch (error) {
    
  }
})


router.get('/total/data', async (req, res) => {
  try {
    const result = await pool.query("SELECT SUM(total_price) AS total_sum FROM order_data");

    // Access the result from the query
    const total = result.rows[0].total_sum;

    // Send a response with the result
    res.status(200).json({ message: "Successfully fetched total price", data: total });
  } catch (error) {
    console.error('Error fetching total:', error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});


module.exports = router;
