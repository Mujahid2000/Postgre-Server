const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  const { email, productid } = req.body;
  try {
    const sID = uuidv4();
    const wishlist_data = await pool.query(
      "INSERT INTO wishlist_data (email, productId, sID) VALUES ($1, $2, $3) RETURNING *",
      [email, productid, sID]
    );
    res
      .status(201)
      .json({ message: "Cart data inserted", data: wishlist_data.rows });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error inserting data" });
  }
});

router.get("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const cart = await pool.query(
      "SELECT p.id AS product_id, w.id AS wish_id, p.productname, p.price,  p.rating, p.description, p.category, p.product_image FROM product_data p INNER JOIN wishlist_data w ON p.idP = w.productId WHERE w.email = $1",
      [email]
    );
    res.status(200).json({ message: "Cart data get success", data: cart.rows });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error inserting data" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const cart_delete = await pool.query(
      "DELETE FROM wishlist_data WHERE id = $1 RETURNING *",
      [id]
    );
    res
      .status(200)
      .json({ message: "favorite item data delete success", data: cart_delete.rows });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Error deleting data" });
  }
});

module.exports = router;
