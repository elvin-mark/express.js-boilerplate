const { pool } = require("../db");
const logger = require("../logger");

async function get_items(pageSize, page) {
  const result = await pool.query(
    `SELECT * FROM items LIMIT ${pageSize} OFFSET ${page * pageSize}`
  );
  logger.info("Fetched items from database");
  return result.rows;
}

module.exports = { get_items };
