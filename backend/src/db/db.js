import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const { Pool } = pg;

const db = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
console.log("Password type:", typeof process.env.PG_PASSWORD);

process.on("SIGINT", async () => {
  try {
    await db.end(); // Closes all active connections in the pool
    console.log("Database connections closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});

const shutdown = async () => {
  try {
    await db.end();
    console.log("Graceful shutdown complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  shutdown();
});

db.on("error", (err, client) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  // Optional: decide if you want to kill the process or recover
});

export default db;
