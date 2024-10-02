require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
  }
);

// Define a model for RFID
const KezadLayout = sequelize.define(
  "KezadLayout",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ScreenName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ActiveLayout: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

// Sync the model with the database
sequelize
  .sync()
  .then(() => console.log("KezadLayout table has been synced."))
  .catch((err) => console.error("Unable to sync the database:", err));

module.exports = {
  sequelize,
  KezadLayout,
};
