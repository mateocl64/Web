const { Sequelize } = require('sequelize');

// Configuración de la base de datos MySQL (XAMPP)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'movexa_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Cambiar a console.log para ver las queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected successfully');
    console.log(`📦 Database: ${process.env.DB_NAME || 'movexa_db'}`);
    console.log(`🖥️  Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    
    // Sincronizar modelos con la base de datos (crear tablas si no existen)
    await sequelize.sync({ alter: false });
    console.log('📊 Database synchronized');
  } catch (error) {
    console.error(`❌ Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };