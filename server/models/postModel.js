const db = require('../config/db');

// 🧩 CREATE new post
async function createPost({ title, description, image_url, user_id }) {
  const sql = `
    INSERT INTO posts (title, description, image_url, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, image_url, user_id, created_at
  `;
  const params = [title, description, image_url, user_id];
  const { rows } = await db.query(sql, params);
  return rows[0];
}

// 🧩 READ all posts (with author info)
async function getAllPosts({ limit = 9, offset = 0, query = "" }) {
  let postsResult;
  let totalResult;
  const searchPattern = `%${query}%`;

  if (query) {
    const postsSql = `
      SELECT p.*, u.name as author_name FROM posts p JOIN users u ON p.user_id = u.id 
      WHERE p.title ILIKE $1 
      ORDER BY p.created_at DESC LIMIT $2 OFFSET $3
    `;
    postsResult = await db.query(postsSql, [searchPattern, limit, offset]);

    const totalSql = `SELECT COUNT(*) FROM posts WHERE title ILIKE $1`;
    totalResult = await db.query(totalSql, [searchPattern]);
  } else {
    const postsSql = `
      SELECT p.*, u.name as author_name FROM posts p JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC LIMIT $1 OFFSET $2
    `;
    postsResult = await db.query(postsSql, [limit, offset]);

    const totalSql = `SELECT COUNT(*) FROM posts`;
    totalResult = await db.query(totalSql);
  }

  const totalPosts = parseInt(totalResult.rows[0].count, 10);

  return { posts: postsResult.rows, totalPosts };
}

// 🧩 READ one post by ID
async function getPostById(id) {
  const sql = `
    SELECT p.id, p.title, p.description, p.image_url, p.created_at,
           u.id AS user_id, u.name AS author_name, u.email AS author_email
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
  `;
  const { rows } = await db.query(sql, [id]);
  return rows[0] || null;
}

// 🧩 UPDATE a post (only by its owner)
async function updatePost({ id, title, description, image_url, user_id }) {
  const sql = `
    UPDATE posts
    SET title = $1,
        description = $2,
        image_url = $3
    WHERE id = $4 AND user_id = $5
    RETURNING id, title, description, image_url, user_id, created_at
  `;
  const params = [title, description, image_url, id, user_id];
  const { rows } = await db.query(sql, params);
  return rows[0] || null;
}

// 🧩 DELETE a post (only by its owner)
async function deletePost(id, user_id) {
  const sql = `
    DELETE FROM posts
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;
  const { rows } = await db.query(sql, [id, user_id]);
  return rows[0] || null;
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
