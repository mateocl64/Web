const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Section name is required' }
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  buttonText: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  lastUpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  timestamps: true,
  tableName: 'contents',
  indexes: [
    { unique: true, fields: ['section'] }
  ]
});

module.exports = Content;