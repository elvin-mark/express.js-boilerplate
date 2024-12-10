const env = process.env.NODE_ENV || "local";
require("dotenv").config({ path: `environments/${env}/.env` });
const express = require("express");
const logger = require("./logger");
const { metricsMiddleware, register } = require("./metrics");
const basicAuth = require("./auth");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");
const itemsService = require("./services/items");

const app = express();
const port = 3000;

app.use(express.json());

app.use(basicAuth);

app.use((req, res, next) => {
  const { method, url } = req;
  const { ip } = req;
  logger.info(`Incoming request: ${method} ${url} from ${ip}`);
  next();
});

app.use(metricsMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Simple endpoint
 *     description: Returns "Hello World!".
 *     responses:
 *       200:
 *         description: return succesfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World!
 */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.send({ status: "OK" });
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).send("Error collecting metrics");
  }
});

/**
 * @swagger
 * /items:
 *   get:
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
app.get("/items", async (req, res) => {
  const pageSize = req.query["pageSize"] || 10;
  const page = req.query["page"] || 0;
  const result = await itemsService.get_items(pageSize, page);
  res.send(result);
});

app.listen(port, () => {
  logger.info(`Server starting on port ${port}`);
});
