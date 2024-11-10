const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  const {
    idP,
    category,
    color,
    shopName,
    shoppicture,
    description,
    stock,
    product_image,
    productname,
    price,
    rating,
  } = req.body;


  const id = uuidv4();

  try {
    const productData = await pool.query(
      "INSERT INTO product_Data (id, category, color, shopName, shoppicture, description, stock, product_image, productname, price, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        id,
        category,
        color,
        shopName,
        shoppicture,
        description,
        stock,
        product_image,
        productname,
        price,
        rating,
      ]
    );
    res
      .status(201)
      .json({ message: "insert data success", data: productData.rows });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error inserting data" });
  }
});

router.get("/", async (req, res) => {
  try {
    const products_Data = await pool.query("SELECT * FROM product_Data");
    // Read all resources
    res
      .status(200)
      .json({ message: "All resources", data: products_Data.rows });
  } catch (error) {
    console.error("Error fetch data:", error);
    res.status(500).json({ message: "Error fetch data" });
  }
});

router.get("/:id", async (req, res) => {
  // Read a single resource by ID
  const id = req.params.id;
  try {
    const singleData = await pool.query(
      "SELECT * FROM product_Data WHERE id = $1",
      [id]
    );
    res
      .status(200)
      .json({ message: "success get single data", data: singleData.rows });
  } catch (error) {
    console.error("Error fetch data:", error);
    res.status(500).json({ message: "Error fetch data" });
  }
});

router.get("/shop/:sp", async (req, res) => {
  const shop = req.params.sp;

  if (!shop) {
    return res.status(400).json({ message: "Error: Shop name is required" });
  }

  console.log("Fetching data for shop:", shop);

  try {
    const shopData = await pool.query(
      "SELECT * FROM product_Data WHERE shopname = $1",
      [shop]
    );

    // Check if the query returned no results
    if (shopData.rows.length === 0) {
      return res.status(404).json({ message: "No products found for this shop" });
    }

    res.status(200).json({ message: "Success: fetched shop data", data: shopData.rows });
  } catch (error) {
    console.error("Error fetching data:", error); // Consider logging the error more robustly in production
    res.status(500).json({ message: "Error fetching data" });
  }
});


router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { stock } = req.body;


  try {
    const updateSingleData = await pool.query(
      "UPDATE product_Data SET stock = $1 WHERE id = $2 RETURNING *",
      [stock, id]
    );
    res.status(201).json({
      message: "Success update",
      updateData: updateSingleData.rows,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Error updating data" });
  }
});


router.delete("/", async (req, res) => {
  const { ids } = req.body; // Expecting an array of IDs in the request body

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No IDs provided" });
  }

  try {
    const deleteQuery = "DELETE FROM product_Data WHERE id = ANY($1::uuid[]) RETURNING *";
    const result = await pool.query(deleteQuery, [ids]);
    res.status(200).json({
      message: "Resources deleted successfully",
      deletedItems: result.rows,
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Error deleting data" });
  }
});


module.exports = router;
