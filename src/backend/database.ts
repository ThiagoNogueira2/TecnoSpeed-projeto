import { Sequelize } from 'sequelize';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'tecnosped';
const DB_USER = process.env.DB_USER || 'tecnosped';
const DB_PASSWORD = process.env.DB_PASSWORD || 'tecnosped';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});