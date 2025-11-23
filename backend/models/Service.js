const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Service title is required' },
      len: {
        args: [1, 100],
        msg: 'Title cannot exceed 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Service description is required' },
      len: {
        args: [1, 500],
        msg: 'Description cannot exceed 500 characters'
      }
    }
  },
  icon: {
    type: DataTypes.STRING(100),
    defaultValue: 'fas fa-cog'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true,
  tableName: 'services',
  indexes: [
    { fields: ['active'] },
    { fields: ['createdBy'] },
    { fields: ['title'] },
    { fields: ['category'] }
  ]
});

module.exports = Service;