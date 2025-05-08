const { Sequelize } = require('sequelize');
const env = require('./envs.js');

const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    
    await sequelize.authenticate();
    console.log('Database connected successfully');

    if (env.NODE_ENV === 'development') { 
      await sequelize.sync({ alter: true });
      console.log('All models were synchronized successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB
};
