import mysql from 'mysql2/promise';
import config from '#config/index.js';

const command = process.argv[2];
const env = config.app.nodeEnv;
const dbConfig = config.db[env];

if (!command) {
  console.error('Usage: node scripts/db.js <create|drop|reset>');
  process.exit(1);
}

async function withAdminConnection(callback) {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password,
    multipleStatements: true,
  });

  try {
    await callback(connection);
  } finally {
    await connection.end();
  }
}

async function createDatabase() {
  await withAdminConnection(async (connection) => {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Database "${dbConfig.database}" created or already exists.`);
  });
}

async function dropDatabase() {
  await withAdminConnection(async (connection) => {
    await connection.query(`DROP DATABASE IF EXISTS \`${dbConfig.database}\``);
    console.log(`Database "${dbConfig.database}" dropped or did not exist.`);
  });
}

async function resetDatabase() {
  await dropDatabase();
  await createDatabase();
}

const actions = {
  create: createDatabase,
  drop: dropDatabase,
  reset: resetDatabase,
};

const action = actions[command];

if (!action) {
  console.error(`Unknown command "${command}". Use create, drop or reset.`);
  process.exit(1);
}

try {
  await action();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
