import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Lead } from './entities/Lead.entity';
import { Region } from './entities/Region.entity';
import { Diagnostic } from './entities/Diagnostic.entity';
import { Assessment } from './entities/Assessment.entity';

const DATABASE_URL = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: [Lead, Region, Diagnostic, Assessment],
  migrations: ['src/db/migrations/**/*.ts'],
  subscribers: [],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' } : false,
});

// Initialize connection (for Next.js API routes)
export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  }
  return AppDataSource;
};