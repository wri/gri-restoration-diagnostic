import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Lead } from './entities/Lead.entity';
import { Region } from './entities/Region.entity';
import { Diagnostic } from './entities/Diagnostic.entity';
import { Assessment } from './entities/Assessment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: [Lead, Region, Diagnostic, Assessment],
  migrations: ['src/db/migrations/**/*.ts'],
  subscribers: [],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize connection (called in API routes or server startup)
export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  }
  return AppDataSource;
};
