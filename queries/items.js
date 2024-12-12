const getItemsQuery = `SELECT * FROM items LIMIT $1 OFFSET $2`;

module.exports = {
  getItemsQuery,
};
