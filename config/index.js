import 'dotenv/config';

const config = {
  app: {
    port: Number(process.env.PORT || 3333),
    host: process.env.HOST || '127.0.0.1',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    development: {
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'database_development',
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
    },
    test: {
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'database_test',
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
    },
    production: {
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'database_production',
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
    },
  },
};

export default config;
