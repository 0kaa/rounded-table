require("dotenv").config(); // Load .env file contents into process.env
const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Hostname
    dialect: process.env.DB_DIALECT, // Database dialect (e.g., mysql)
    port: process.env.DB_PORT, // Database port
    dialectOptions: {
      // Update or remove options as needed
    },
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

// Define a model
const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  }
);

// Sync the model with the database
sequelize
  .sync()
  .then(() => console.log("User table has been synced."))
  .catch((err) => console.error("Unable to sync the database:", err));

module.exports = {
  sequelize,
  User,
};
