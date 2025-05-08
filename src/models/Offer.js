
// Offer.js
const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const Offer = sequelize.define("Offer", {
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
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    allowNull: false,
    defaultValue: "pending"
  }
}, {
  timestamps: true,
});

module.exports = Offer;