const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Service = require('../models/Service');
const Content = require('../models/Content');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const readJSONFile = (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return null;
};

const migrateUsers = async () => {
  const usersData = readJSONFile('users.json');
  if (!usersData || !usersData.users) {
    console.log('⚠️  No users data found');
    return null;
  }

  console.log(`\n📦 Migrating ${usersData.users.length} users...`);
  
  const userMap = {};
  
  for (const userData of usersData.users) {
    try {
      let user = await User.findOne({ email: userData.email });
      
      if (!user) {
        user = new User({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          lastLogin: userData.lastLogin || new Date(),
        });
        
        await user.save({ validateBeforeSave: false });
        console.log(`  ✅ Migrated user: ${user.username}`);
      } else {
        console.log(`  ⏭️  User already exists: ${user.username}`);
      }
      
      userMap[userData.id] = user._id;
    } catch (error) {
      console.error(`  ❌ Error migrating user ${userData.username}:`, error.message);
    }
  }
  
  return userMap;
};

const migrateServices = async (userMap) => {
  const servicesData = readJSONFile('services.json');
  if (!servicesData || !servicesData.services) {
    console.log('⚠️  No services data found');
    return;
  }

  console.log(`\n📦 Migrating ${servicesData.services.length} services...`);
  
  const defaultUser = await User.findOne({ role: 'admin' });
  
  for (const serviceData of servicesData.services) {
    try {
      const existingService = await Service.findOne({ title: serviceData.title });
      
      if (!existingService) {
        const service = new Service({
          title: serviceData.title,
          description: serviceData.description,
          icon: serviceData.icon,
          category: serviceData.category,
          active: serviceData.active !== false,
          createdBy: defaultUser._id,
        });
        
        await service.save();
        console.log(`  ✅ Migrated service: ${service.title}`);
      } else {
        console.log(`  ⏭️  Service already exists: ${serviceData.title}`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrating service ${serviceData.title}:`, error.message);
    }
  }
};

const migrateContent = async () => {
  const contentData = readJSONFile('content.json');
  if (!contentData || !contentData.sections) {
    console.log('⚠️  No content data found');
    return;
  }

  console.log(`\n📦 Migrating ${Object.keys(contentData.sections).length} content sections...`);
  
  for (const [sectionName, sectionData] of Object.entries(contentData.sections)) {
    try {
      const existingContent = await Content.findOne({ section: sectionName });
      
      if (!existingContent) {
        const content = new Content({
          section: sectionName,
          ...sectionData,
        });
        
        await content.save();
        console.log(`  ✅ Migrated content: ${sectionName}`);
      } else {
        console.log(`  ⏭️  Content already exists: ${sectionName}`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrating content ${sectionName}:`, error.message);
    }
  }
};

const migrate = async () => {
  console.log('🚀 Starting migration to MongoDB...\n');
  
  await connectDB();
  
  try {
    const userMap = await migrateUsers();
    await migrateServices(userMap);
    await migrateContent();
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Final counts:');
    console.log(`  Users: ${await User.countDocuments()}`);
    console.log(`  Services: ${await Service.countDocuments()}`);
    console.log(`  Content sections: ${await Content.countDocuments()}`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
};

migrate();