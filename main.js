const express = require("express");
const logger = require("./logger");
const { metricsMiddleware, register } = require("./metrics");
const { basicAuth, checkRole } = require("./auth");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");
const itemsController = require("./controllers/items");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

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

app.get("/items", checkRole("ADMIN"), itemsController.getItems);

app.listen(port, () => {
  logger.info(`Server starting on port ${port}`);
});
