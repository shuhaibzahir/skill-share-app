require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 5010,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1h',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_NAME: process.env.DB_NAME || 'taskmanagement',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432, // Default PostgreSQL port
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*', // Adjust as needed
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS || true

}