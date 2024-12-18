const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { pool } = require("./db");
const logger = require("./logger");

const hashFileContent = (content) => {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
};

const ensureMigrationsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL,
      hash TEXT NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
};

const getAppliedMigrations = async () => {
  const result = await pool.query("SELECT filename, hash FROM migrations");
  return result.rows.reduce((acc, row) => {
    acc[row.filename] = row.hash;
    return acc;
  }, {});
};

const applyMigration = async (filename, hash, content) => {
  try {
    logger.info(`Applying migration: ${filename}`);
    await pool.query(content);
    await pool.query(
      "INSERT INTO migrations (filename, hash) VALUES ($1, $2)",
      [filename, hash]
    );
    logger.info(`Migration applied: ${filename}`);
  } catch (err) {
    logger.error(`Failed to apply migration ${filename}:`, err.message);
    throw err;
  }
};

const runMigrations = async () => {
  const schemasPath = "./schemas";
  const files = fs
    .readdirSync(schemasPath)
    .filter((file) => file.endsWith(".sql"));

  if (files.length === 0) {
    logger.info("No schema files found in the './schemas' folder.");
    return;
  }

  await ensureMigrationsTable();
  const appliedMigrations = await getAppliedMigrations();

  for (const file of files) {
    const filePath = path.join(schemasPath, file);
    const content = fs.readFileSync(filePath, "utf8");
    const hash = hashFileContent(content);

    if (appliedMigrations[file] && appliedMigrations[file] === hash) {
      logger.info(`Skipping already applied migration: ${file}`);
      continue;
    }

    if (appliedMigrations[file] && appliedMigrations[file] !== hash) {
      throw new Error(`File ${file} has been modified`);
    }

    await applyMigration(file, hash, content);
  }

  logger.info("All migrations have been applied.");
};

if (require.main != null && require.main === module) {
  runMigrations()
    .then(() => {
      logger.info("Migrations completed.");
    })
    .catch((err) => {
      logger.error("Error during migration:", err);
    });
}

module.exports = { runMigrations };
