
const { Pool } = require('pg')
 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'e_commerce',
  port:5432
})

module.exports = pool;