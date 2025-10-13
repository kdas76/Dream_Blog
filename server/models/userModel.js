// server/models/userModel.js
// DB helper for users. Uses parameterized queries to avoid SQL injection.

const db = require('../config/db'); // expects db.query(sql, params)
const { BCRYPT_SALT_ROUNDS } = process.env;

async function createUser({ name, email, hashedPassword }) {
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const params = [name, email, hashedPassword];
  const { rows } = await db.query(sql, params);
  return rows[0];
}

async function getUserByEmail(email) {
  const sql = `SELECT id, name, email, password, created_at FROM users WHERE email = $1`;
  const { rows } = await db.query(sql, [email]);
  return rows[0] || null;
}

async function getUserById(id) {
  const sql = `SELECT id, name, email, created_at FROM users WHERE id = $1`;
  const { rows } = await db.query(sql, [id]);
  return rows[0] || null;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
