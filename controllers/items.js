const itemsService = require("../services/items");

/**
 * @swagger
 * /items:
 *   get:
 *     tags: ["Items"]
 *     summary: Get all items
 *     description: Retrieves all items from the database.
 *     parameters:
 *      - name: pageSize
 *        in: query
 *        type: number
 *      - name: page
 *        in: query
 *        type: number
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal Server Error
 */
const getItems = async (req, res) => {
  const pageSize = req.query["pageSize"] || 10;
  const page = req.query["page"] || 0;
  const result = await itemsService.get_items(pageSize, page);
  res.send(result);
};

module.exports = { getItems };
