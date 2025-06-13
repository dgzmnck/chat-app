import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const adminPool = new Pool({ connectionString: process.env.ADMIN_DB_URL });
const targetDb = process.env.DATABASE_NAME;

const createDatabaseIfNotExists = async () => {
  const res = await adminPool.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [targetDb]
  );
  if (res.rowCount === 0) {
    await adminPool.query(`CREATE DATABASE ${targetDb}`);
    console.log(`✅ Database created: ${targetDb}`);
  } else {
    console.log(`📦 Database already exists: ${targetDb}`);
  }
  await adminPool.end();
};

const createTable = async () => {
  const dbUrl = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${targetDb}`;
  const userPool = new Pool({ connectionString: dbUrl });

  await userPool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender TEXT NOT NULL,
      message TEXT NOT NULL,
      sent_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log("✅ Table ensured: messages");
  await userPool.end();
};

const initDB = async () => {
  await createDatabaseIfNotExists();
  await createTable();
};

export default initDB;
