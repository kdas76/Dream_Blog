// server/db.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

module.exports = {
  query: async (text, params) => {
    try {
      const client = await pool.connect();
      const result = await client.query(text, params);
      client.release();
      return result;
    } catch (err) {
      console.error("❌ Database query error:", err.message);
      // Re-throw the error to be caught by the controller
      throw err;
    }
  },
};
