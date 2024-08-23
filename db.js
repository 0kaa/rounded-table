const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize("nitro", "root", "", {
  host: "127.0.0.1", // Use IPv4 loopback address
  dialect: "mysql", // Specify MySQL as the dialect
  port: 3306, // Default MySQL port
  dialectOptions: {
    // Remove unrecognized options or update as needed
  },
});

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
