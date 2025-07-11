const { Sequelize } = require('sequelize');
const dbConfig = require('./../../../config/databases.json');

// Выбираем конфиг в зависимости от окружения
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Создаем экземпляр Sequelize
const sequelize = new Sequelize(config);

module.exports = sequelize;