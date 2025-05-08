const { sequelize } = require("../config/database.js");
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const envs = require('../config/envs.js');

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM("individual", "company"),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("user", "provider"),
    allowNull: false
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  companyName: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  businessTaxNumber: {
    type: DataTypes.STRING(10),
    validate: {
      isAlphanumeric: true,
      len: [1, 10]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  streetNumber: DataTypes.STRING,
  streetName: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  postCode: DataTypes.STRING,
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
 
}, {
  timestamps: true,
 
});

// Method 3 via the direct method
User.beforeCreate(async (user, options) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
}
);
  
// Instance methods
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this.id, role: this.role },
    envs.JWT_SECRET,
    { expiresIn: envs.JWT_EXPIRE }
  );
};

// Static methods
User.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

module.exports = User;
