require('dotenv').config(); // Load .env variables

console.log(process.env.DB_USERNAME);
module.exports = {
  development: {
    username: process.env.DB_USER, // Get username from .env
    password: process.env.DB_PASSWORD, // Get password from .env
    database: process.env.DB_NAME, // Get database name from .env
    host: process.env.DB_HOST, // Get host from .env
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};
