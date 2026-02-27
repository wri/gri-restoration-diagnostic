#!/usr/bin/env ts-node
/**
 * Validate Translation Completeness and Consistency
 * 
 * Usage: 
 *   npm run i18n:validate
 *   npm run i18n:validate -- --questions-only
 *   npm run i18n:validate -- --ci
 * 
 * Features:
 * - Validates question translations in database
 * - Checks for missing translations
 * - Generates coverage report
 * - Exit code 1 for CI failures
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { initializeDatabase } from '../../db/data-source'
import { Question } from '../../db/entities/Question.entity'

async function validateTranslations(options: { questionsOnly?: boolean; ci?: boolean } = {}) {
  const errors: string[] = []
  const warnings: string[] = []
  
  console.log('\n' + '='.repeat(60))
  console.log('TRANSLATION VALIDATION REPORT')
  console.log('='.repeat(60) + '\n')
  
  // Validate question translations in database
  const dataSource = await initializeDatabase()
  
  try {
    const expectedQuestions = 31
    const supportedLocales = ['en'] // Expand to ['en', 'es'] when Spanish is added
    
    for (const locale of supportedLocales) {
      const count = await dataSource
        .getRepository(Question)
        .createQueryBuilder('q')
        .leftJoin('q.diagnostic', 'd')
        .where('d.language = :locale', { locale })
        .getCount()
      
      if (count < expectedQuestions) {
        errors.push(`${locale}: Only ${count}/${expectedQuestions} question translations found`)
      } else if (count > expectedQuestions) {
        warnings.push(`${locale}: ${count}/${expectedQuestions} question translations (more than expected)`)
      } else {
        console.log(`✅ ${locale}: All ${expectedQuestions} questions present`)
      }
      
      // Check for questions with missing content
      const questionsWithIssues = await dataSource
        .getRepository(Question)
        .createQueryBuilder('q')
        .leftJoin('q.diagnostic', 'd')
        .where('d.language = :locale', { locale })
        .andWhere('(q.question_text IS NULL OR q.question_text = \'\')')
        .getMany()
      
      if (questionsWithIssues.length > 0) {
        errors.push(`${locale}: ${questionsWithIssues.length} questions missing questionText`)
        questionsWithIssues.forEach(q => {
          console.log(`  ❌ ${q.questionCode}: Missing questionText`)
        })
      }
    }
    
    // Validate JSON files exist (if not questions-only mode)
    if (!options.questionsOnly) {
      const translationsDir = 'src/i18n/translations'
      
      if (existsSync(translationsDir)) {
        const files = readdirSync(translationsDir).filter(f => f.startsWith('questions-') && f.endsWith('.json'))
        
        console.log(`\n📁 Found ${files.length} question translation file(s):`)
        files.forEach(f => console.log(`   - ${f}`))
        
        // Validate each JSON file is valid
        files.forEach(file => {
          try {
            const content = readFileSync(`${translationsDir}/${file}`, 'utf-8')
            const json = JSON.parse(content)
            const keys = Object.keys(json)
            
            if (keys.length === 0) {
              warnings.push(`${file}: Empty translation file`)
            } else {
              console.log(`\n✅ ${file}: Valid JSON with ${keys.length} entries`)
            }
          } catch (error) {
            errors.push(`${file}: Invalid JSON - ${error}`)
          }
        })
      } else {
        warnings.push(`Translations directory not found: ${translationsDir}`)
      }
    }
    
    // Print report summary
    console.log('\n' + '='.repeat(60))
    
    if (errors.length > 0) {
      console.log('\n❌ ERRORS:\n')
      errors.forEach(e => console.error(`   ${e}`))
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:\n')
      warnings.forEach(w => console.warn(`   ${w}`))
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('\n✅ All validations passed!')
    }
    
    console.log('\n' + '='.repeat(60) + '\n')
    
    // Exit with error code for CI
    if (options.ci && errors.length > 0) {
      process.exit(1)
    }
    
  } catch (error) {
    console.error('\n❌ Validation error:', error)
    throw error
  } finally {
    await dataSource.destroy()
  }
}

// CLI Argument Parsing
function parseArgs() {
  const args = process.argv.slice(2)
  const options: { questionsOnly?: boolean; ci?: boolean } = {}
  
  args.forEach(arg => {
    if (arg === '--questions-only') {
      options.questionsOnly = true
    } else if (arg === '--ci') {
      options.ci = true
    }
  })
  
  return options
}

// Main execution
if (require.main === module) {
  const options = parseArgs()
  
  validateTranslations(options)
    .then(() => {
      console.log('✅ Validation completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Validation failed:', error)
      process.exit(1)
    })
}

export { validateTranslations }
