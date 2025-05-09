
// Task.js
const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Users", key: "id" }
  },
  category: {
    type: DataTypes.ENUM("fullstack", "backend", "frontend", "mobile"), 
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expectedStartDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  expectedWorkingHours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hourlyRate: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  currency: {
    type: DataTypes.ENUM("USD", "AUD", "INR", "SGD"),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("open", "closed"),
    allowNull: false,
    defaultValue: "open"
  }
}, {
  timestamps: true,
});

module.exports = Task;
