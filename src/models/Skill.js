
// Skill.js
const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const Skill = sequelize.define("Skill", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  providerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Users", key: "id" }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nature: {
    type: DataTypes.ENUM("onsite", "online"),
    allowNull: false
  },
  hourlyRate: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: true,
});

module.exports = Skill;