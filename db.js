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
const RFID = sequelize.define(
  "RFID",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rfidCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure RFID code is unique
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false, // URL of the uploaded video
    },
  },
  {
    // Other model options can go here
  }
);

// Sync the model with the database
sequelize
  .sync()
  .then(() => console.log("RFID table has been synced."))
  .catch((err) => console.error("Unable to sync the database:", err));

module.exports = {
  sequelize,
  RFID,
};
