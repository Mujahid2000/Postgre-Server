const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

router.post('/', async (req, res) => {
    const { shopName, shopId, rating, shopPicture } = req.body; // Removed shopId from the destructuring since you are generating it
    try {
        const sID = uuidv4(); // Generate a unique shopId
        const shop_name = await pool.query(
            'INSERT INTO shop_data (sid, shop_id, shopName, rating, shopPicture) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [sID, shopId, shopName, rating, shopPicture]
        );

        res.status(201).json({
            message: 'Shop data inserted successfully', 
            data: shop_name.rows[0] // `rows[0]` returns the inserted row
        });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: "Error inserting data" });
    }
});

router.get('/:shop', async(req, res) =>{
    const shop = req.params.shop;
   
    try {
        const shopdata =await pool.query('SELECT * FROM shop_data WHERE shopName = $1', [shop])
        res
      .status(200)
      .json({ message: "favorite item data delete success", data:shopdata.rows });
    } catch (error) {
        
    }
})

router.get('/', async(req, res) =>{
    try {
        const shopdata =await pool.query('SELECT * FROM shop_data')
        res
      .status(200)
      .json({ message: "favorite item data delete success", data:shopdata.rows });
    } catch (error) {
        
    }
})

module.exports = router;