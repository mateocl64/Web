require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');

async function createAdminUser() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync();
    console.log('📊 Tablas sincronizadas');

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    
    if (existingAdmin) {
      console.log('⚠️  El usuario admin ya existe, actualizando contraseña...');
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('✅ Contraseña actualizada exitosamente');
      console.log('👤 Username: admin');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Crear usuario admin
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@movexa.com',
      password: 'admin123', // Será hasheada automáticamente
      role: 'admin'
    });

    console.log('✅ Usuario admin creado exitosamente');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
