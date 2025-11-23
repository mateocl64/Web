const User = require('./User');
const Service = require('./Service');
const Content = require('./Content');

// Definir relaciones entre modelos
User.hasMany(Service, {
  foreignKey: 'createdBy',
  as: 'services'
});

Service.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

User.hasMany(Content, {
  foreignKey: 'lastUpdatedBy',
  as: 'updatedContents'
});

Content.belongsTo(User, {
  foreignKey: 'lastUpdatedBy',
  as: 'updater'
});

module.exports = {
  User,
  Service,
  Content
};
