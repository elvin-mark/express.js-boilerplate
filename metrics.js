const promClient = require("prom-client");

const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

const endpointHitCounter = new promClient.Counter({
  name: "api_endpoint_hits_total",
  help: "Total number of hits to all API endpoints",
  labelNames: ["method", "endpoint"],
});

register.registerMetric(endpointHitCounter);

const metricsMiddleware = (req, res, next) => {
  endpointHitCounter.labels(req.method, req.path).inc();
  next();
};

module.exports = {
  metricsMiddleware,
  register,
};
