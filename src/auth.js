const bcrypt = require("bcrypt");
const { pool } = require("./db");
const usersService = require("./queries/users");
const logger = require("./logger");

const whitelistEndpoints = ["/api-docs/*", "/", "/metrics", "/health"];

const matchesWhitelist = (path) => {
  return whitelistEndpoints.some((endpoint) => {
    const regex = new RegExp(`^${endpoint.replace("*", ".*")}$`);
    return regex.test(path);
  });
};

const basicAuth = async (req, res, next) => {
  if (matchesWhitelist(req.path)) {
    next();
    return;
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  try {
    const result = await pool.query(usersService.getUsersByNameQuery, [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = { id: user.id, username: user.username };
    next();
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkRole = (role) => {
  return async (req, res, next) => {
    const result = await pool.query(usersService.getRolesByUserId, [
      req.user.id,
    ]);
    const foundRole = result.rows.find((e) => e["name"] == role);
    if (!foundRole) {
      res.status(400).json({ error: "Not Authorized" });
      return;
    }
    next();
  };
};

module.exports = { basicAuth, checkRole };
