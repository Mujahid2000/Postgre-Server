const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { discountId, stock, percentage, discountPrice } = req.body;

  try {
    const discount_data = await pool.query(
      "INSERT INTO discount_product (discountId, stock, percentage, discountPrice) VALUES ($1, $2, $3, $4) RETURNING *",
      [discountId, stock, percentage, discountPrice]
    );
    res
      .status(200)
      .json({ message: "Data insert success", data: discount_data.rows[0] });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error inserting data" });
  }
});

router.get("/", async (req, res) => {
  try {
    getDis_data = await pool.query(
      "SELECT p.id,  p.category, p.color, p.shopname, p.idp, p.shoppicture, p.description, d.stock, d.discountPrice, p.price, p.product_image, p.productname, p.price, p.rating FROM product_data p INNER JOIN  discount_product d ON d.discountid = p.idp"
    );
    res.status(200).json({ message: "All resources", data: getDis_data.rows });
  } catch (error) {}
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    getDis_data = await pool.query(
      "SELECT p.id, p.category, p.color, d.discountprice, p.shopname, p.shoppicture, p.description, p.stock, p.product_image, p.productname, p.price, p.rating FROM product_data p INNER JOIN discount_product d ON d.discountid = p.idp WHERE p.id = $1",[id]
    );
    res.status(200).json({ message: "All resources", data: getDis_data.rows });
  } catch (error) {}
});

module.exports = router;
