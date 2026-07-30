require('dotenv').config();

const baseConfig = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
};

module.exports = {
  development: {
    ...baseConfig,
    database: process.env.DB_NAME || 'database_development',
  },
  test: {
    ...baseConfig,
    database: process.env.DB_NAME || 'database_test',
  },
  production: {
    ...baseConfig,
    database: process.env.DB_NAME || 'database_production',
  },
};
