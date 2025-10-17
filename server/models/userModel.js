const db = require('../config/db');

async function createUser({ name, email, hashedPassword, verificationToken }) {
  const sql = `
    INSERT INTO users (name, email, password, verified, verification_token)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, verified, created_at
  `;
  const params = [name, email, hashedPassword, false, verificationToken];
  const { rows } = await db.query(sql, params);
  return rows[0];
}

async function getUserByEmail(email) {
  const sql = `SELECT id, name, email, password, verified, verification_token, created_at, role FROM users WHERE email = $1`;
  const { rows } = await db.query(sql, [email]);
  return rows[0] || null;
}

async function getUserByVerificationToken(token) {
  const sql = `SELECT * FROM users WHERE verification_token = $1`;
  const { rows } = await db.query(sql, [token]);
  return rows[0] || null;
}

async function verifyUserEmail(token) {
  const sql = `
    UPDATE users
    SET verified = true, verification_token = NULL
    WHERE verification_token = $1
    RETURNING id, email, verified
  `;
  const { rows } = await db.query(sql, [token]);
  return rows[0];
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserByVerificationToken,
  verifyUserEmail,
};
