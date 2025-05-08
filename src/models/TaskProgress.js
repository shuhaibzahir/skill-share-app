
// TaskProgress.js
const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const TaskProgress = sequelize.define("TaskProgress", {
  id: {
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Tasks", key: "id" }
  },
  providerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Users", key: "id" }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  timestamps: false,
});

module.exports = TaskProgress;
