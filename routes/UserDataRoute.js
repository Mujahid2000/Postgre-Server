const express = require("express");
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

router.post('/', async(req, res) =>{
    const {name, email , password, admin} = req.body;
    const id = uuidv4();
    try {
        const userData =await pool.query('INSERT INTO user_data (id, name, email, password, admin) VALUES ( $1, $2, $3, $4, $5) RETURNING *',
            [
                id,name,email, password, admin
            ]
        );
        res.status(200).json({message: 'user data will be inserted', data: userData.rows})
    } catch (error) {
        console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error inserting data" });
    }
})

router.get('/', async(req, res) =>{
    try {
        const user_data = await pool.query(' SELECT * FROM user_data');
        res.status(201).json({message:'data get success', data:user_data.rows})
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: "Error inserting data" });
    }
})

router.get('/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user_data = await pool.query('SELECT * FROM user_data WHERE email = $1', [email]);
        if (user_data.rows.length > 0) {
            res.status(200).json({ message: 'Data retrieved successfully', data: user_data.rows[0] });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ message: "Error retrieving data" });
    }
});


module.exports = router;