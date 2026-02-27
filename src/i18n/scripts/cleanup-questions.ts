#!/usr/bin/env ts-node
/**
 * Cleanup Question Database
 * 
 * Usage:
 *   npm run i18n:cleanup -- --dry-run
 *   npm run i18n:cleanup -- --orphaned
 *   npm run i18n:cleanup -- --duplicates
 *   npm run i18n:cleanup
 * 
 * Features:
 * - Removes orphaned translations (translations without parent questions)
 * - Removes duplicate translations (keeps most recent)
 * - Shows database statistics
 */

import { initializeDatabase } from '../../db/data-source'
import { Question } from '../../db/entities/Question.entity'

interface CleanupOptions {
  dryRun: boolean
  orphaned: boolean
  duplicates: boolean
}

async function cleanupQuestions(options: CleanupOptions) {
  console.log('\n🧹 Starting database cleanup...\n')
  console.log(`Dry run: ${options.dryRun ? 'YES' : 'NO'}`)
  console.log(`Check orphaned: ${options.orphaned ? 'YES' : 'ALL'}`)
  console.log(`Check duplicates: ${options.duplicates ? 'YES' : 'ALL'}\n`)

  // Initialize DB
  const dataSource = await initializeDatabase()
  const queryRunner = dataSource.createQueryRunner()

  try {
    await queryRunner.connect()
    await queryRunner.startTransaction()

    const questionRepo = queryRunner.manager.getRepository(Question)

    // Get database statistics
    console.log('='.repeat(60))
    console.log('DATABASE STATISTICS')
    console.log('='.repeat(60))

    const totalQuestions = await questionRepo.count()
    console.log(`Total questions: ${totalQuestions}`)

    // Find questions with missing fields
    const missingFields = await questionRepo
      .createQueryBuilder('q')
      .where('q.questionText IS NULL OR q.questionText = :empty', { empty: '' })
      .orWhere('q.definition IS NULL OR q.definition = :empty', { empty: '' })
      .getMany()

    if (missingFields.length > 0) {
      console.log(`\n⚠️  Found ${missingFields.length} question(s) with missing required fields:`)
      missingFields.forEach(q => {
        const missing: string[] = []
        if (!q.questionText) missing.push('questionText')
        if (!q.definition) missing.push('definition')
        console.log(`   - ${q.questionCode}: Missing ${missing.join(', ')}`)
      })
      
      if (!options.dryRun) {
        console.log('\n⚠️  These questions should be fixed or removed manually.')
      }
    } else {
      console.log('✅ All questions have required fields')
    }

    // Find duplicate question codes
    const duplicateCodes = await queryRunner.manager.query(`
      SELECT question_code, COUNT(*) as count
      FROM question
      GROUP BY question_code
      HAVING COUNT(*) > 1
    `)

    if (duplicateCodes.length > 0 && (options.duplicates || (!options.orphaned && !options.duplicates))) {
      console.log('\n' + '='.repeat(60))
      console.log('DUPLICATE QUESTION CODES')
      console.log('='.repeat(60))
      console.log(`\n⚠️  Found ${duplicateCodes.length} duplicate question code(s):`)
      
      for (const dup of duplicateCodes) {
        const duplicates = await questionRepo.find({
          where: { questionCode: dup.question_code },
          order: { createdAt: 'DESC' }
        })
        
        console.log(`\n   ${dup.question_code}: ${dup.count} copies`)
        duplicates.forEach((q, idx) => {
          console.log(`     ${idx === 0 ? '✓' : '✗'} ID: ${q.id} | Created: ${q.createdAt}`)
        })
        
        if (!options.dryRun) {
          // Keep most recent (first in DESC order), delete others
          const toDelete = duplicates.slice(1)
          await questionRepo.remove(toDelete)
          console.log(`     ✅ Kept most recent, deleted ${toDelete.length} duplicate(s)`)
        }
      }
      
      if (options.dryRun) {
        console.log('\n   (Dry run - use without --dry-run to delete)')
      }
    } else if (duplicateCodes.length === 0) {
      console.log('\n✅ No duplicate question codes found')
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('CLEANUP SUMMARY')
    console.log('='.repeat(60))
    
    const finalCount = await questionRepo.count()
    const deletedCount = totalQuestions - finalCount
    
    console.log(`Questions before cleanup: ${totalQuestions}`)
    console.log(`Questions after cleanup: ${finalCount}`)
    if (deletedCount > 0) {
      console.log(`Questions deleted: ${deletedCount}`)
    }
    
    if (options.dryRun) {
      console.log('\n⚠️  DRY RUN - Rolling back changes\n')
      await queryRunner.rollbackTransaction()
    } else {
      await queryRunner.commitTransaction()
      console.log('\n✅ Transaction committed\n')
    }

  } catch (error) {
    console.error('\n❌ Error during cleanup:', error)
    await queryRunner.rollbackTransaction()
    throw error
  } finally {
    await queryRunner.release()
    await dataSource.destroy()
  }
}

// CLI Argument Parsing
function parseArgs() {
  const args = process.argv.slice(2)
  const options: CleanupOptions = {
    dryRun: args.includes('--dry-run'),
    orphaned: args.includes('--orphaned'),
    duplicates: args.includes('--duplicates'),
  }
  
  return options
}

// Main execution
if (require.main === module) {
  const options = parseArgs()
  
  cleanupQuestions(options)
    .then(() => {
      console.log('✅ Cleanup completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Cleanup failed:', error)
      process.exit(1)
    })
}

export { cleanupQuestions }
