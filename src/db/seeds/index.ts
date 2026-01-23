import { AppDataSource } from '../data-source';
import { Diagnostic } from '../entities';
import { initialDiagnosticSeed } from './001-initial-diagnostic.seed';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('🔄 Running database seeds...');

    const diagnosticRepo = AppDataSource.getRepository(Diagnostic);

    // Check if seed already exists
    const exists = await diagnosticRepo.findOne({
      where: { version: 'v1.0.0', language: 'en' }
    });

    if (!exists) {
      await diagnosticRepo.save(initialDiagnosticSeed);
      console.log('✅ Initial diagnostic seed data inserted (v1.0.0, English, 24 questions)');
    } else {
      console.log('⚠️  Seed data already exists - skipping');
    }

    await AppDataSource.destroy();
    console.log('✅ Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeds();
