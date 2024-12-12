const { pool } = require("../db");
const logger = require("../logger");
const itemsQueries = require("../queries/items");

async function get_items(pageSize, page) {
  const result = await pool.query(itemsQueries.getItemsQuery, [
    pageSize,
    page * pageSize,
  ]);
  logger.info("Fetched items from database");
  return result.rows;
}

module.exports = { get_items };
