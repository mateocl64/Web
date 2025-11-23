require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkSetup() {
  console.log('🔍 Verificando configuración...\n');

  // Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || '3306'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'movexa_db'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'root'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ No configurado'}`);
  console.log('');

  // Intentar conexión a MySQL
  try {
    console.log('🔌 Probando conexión a MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ Conexión a MySQL exitosa\n');

    // Verificar si la base de datos existe
    const [databases] = await connection.query(
      `SHOW DATABASES LIKE '${process.env.DB_NAME || 'movexa_db'}'`
    );

    if (databases.length > 0) {
      console.log('✅ Base de datos encontrada\n');

      // Usar la base de datos
      await connection.query(`USE ${process.env.DB_NAME || 'movexa_db'}`);

      // Verificar tablas
      const [tables] = await connection.query('SHOW TABLES');
      console.log('📊 Tablas en la base de datos:');
      if (tables.length > 0) {
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`   ✅ ${tableName}`);
        });

        // Contar registros
        console.log('\n📈 Registros:');
        try {
          const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
          console.log(`   👤 Usuarios: ${users[0].count}`);
        } catch (e) {
          console.log(`   ⚠️  Tabla users no encontrada`);
        }

        try {
          const [services] = await connection.query('SELECT COUNT(*) as count FROM services');
          console.log(`   🛠️  Servicios: ${services[0].count}`);
        } catch (e) {
          console.log(`   ⚠️  Tabla services no encontrada`);
        }

        try {
          const [contents] = await connection.query('SELECT COUNT(*) as count FROM contents');
          console.log(`   📄 Contenidos: ${contents[0].count}`);
        } catch (e) {
          console.log(`   ⚠️  Tabla contents no encontrada`);
        }
      } else {
        console.log('   ⚠️  No hay tablas en la base de datos');
        console.log('\n💡 Ejecuta el script SQL: backend/scripts/setup-database.sql en phpMyAdmin');
      }
    } else {
      console.log('❌ Base de datos NO encontrada\n');
      console.log('💡 Sigue estos pasos:');
      console.log('   1. Abre http://localhost/phpmyadmin');
      console.log('   2. Ve a la pestaña SQL');
      console.log('   3. Pega el contenido de: backend/scripts/setup-database.sql');
      console.log('   4. Haz clic en Continuar');
    }

    await connection.end();
    console.log('\n✅ Verificación completada\n');
    console.log('🚀 Para iniciar el servidor ejecuta: npm start');

  } catch (error) {
    console.error('\n❌ Error al conectar a MySQL:');
    console.error(`   ${error.message}\n`);
    console.log('💡 Verifica que:');
    console.log('   1. XAMPP esté corriendo');
    console.log('   2. MySQL esté iniciado en XAMPP');
    console.log('   3. Las credenciales en .env sean correctas\n');
    process.exit(1);
  }
}

checkSetup();
