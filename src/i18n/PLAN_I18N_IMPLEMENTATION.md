# Internationalization (i18n) Implementation Plan

> **Created:** February 26, 2026  
> **Status:** Planning Phase  
> **Tech Stack:** Next.js 15.1.7 + next-intl + Cookie-based Locale + QuestionTranslation Table

---

## Summary

Multi-phase plan to add internationalization support to the Restoration Diagnostic application. Starting with English and Spanish, using next-intl library with cookie-based locale switching (no URL changes). Question content stored in database QuestionTranslation table. UI strings in organized JSON files under `src/i18n/translations/`.

**Key Decisions:**
- ✅ Cookie-based locale (preserves existing URLs)
- ✅ QuestionTranslation table (single source of truth, easier maintenance)
- ✅ next-intl library (optimized for Next.js 15 App Router)
- ✅ Start with English + Spanish (can expand to French/Portuguese later)
- ✅ JSON organized by route/feature for translator clarity
- ✅ Directory structure: `src/i18n/` for config, `src/i18n/translations/` for language files
- ✅ Automated workflow for stakeholder-driven translation updates


**Directory Structure:**
```
src/i18n/
├── config.ts                      # Supported locales, default locale
├── request.ts                     # Server-side locale detection
├── translations/
│   ├── en.json                    # English UI strings
│   ├── es.json                    # Spanish UI strings
│   ├── questions-en.json          # English question content
│   └── questions-es.json          # Spanish question content
└── scripts/
    ├── extract-ui-strings.ts      # Extract strings from components
    ├── import-question-csv.ts     # Import questions from CSV
    ├── sync-translations.ts       # Sync DB ↔ JSON files
    └── validate-translations.ts   # Check for missing keys
```

---

## Phase 1: Create Translation JSON Structure

**Goal:** Extract all UI strings into organized JSON files for translation requests.

### Deliverables

1. **Translation Files**
   - `src/i18n/translations/en.json` - English source text (~150-200 keys)
   - `src/i18n/translations/es.json` - Spanish translation template (same structure, empty values)
   - `src/i18n/translations/questions-en.json` - All 31 questions content (separate due to size)
   - `src/i18n/translations/questions-es.json` - Questions translation template

2. **Configuration Files**
   - `src/i18n/config.ts` - Locale configuration (locales, default language)
   - `src/i18n/request.ts` - Server-side locale resolution

3. **Automation Scripts** (under `src/i18n/scripts/`)
   - `extract-ui-strings.ts` - Extract hardcoded strings from components
   - `import-question-csv.ts` - Import question translations from CSV
   - `sync-translations.ts` - Bidirectional sync between DB and JSON files
   - `validate-translations.ts` - Validate translation completeness

### JSON Structure

```json
{
  "common": {
    "brand": "Restoration Diagnostic",
    "buttons": {
      "continue": "Continue",
      "save": "Save",
      "cancel": "Cancel"
    }
  },
  "navigation": {
    "languages": {
      "en": "English",
      "es": "Español"
    },
    "themes": {
      "motivate": "Motivate",
      "enable": "Enable",
      "implement": "Implement"
    }
  },
  "forms": {
    "setup": {
      "labels": { ... },
      "placeholders": { ... },
      "validation": { ... }
    }
  },
  "assessment": {
    "navigation": { ... },
    "content": { ... },
    "guidance": { ... },
    "actions": { ... }
  },
  "auth": {
    "buttons": { ... },
    "errors": { ... }
  },
  "errors": {
    "api": { ... }
  },
  "metadata": {
    "title": "Restoration Diagnostic",
    "description": "..."
  }
}
```

### Tasks

- [ ] Create `src/i18n/` directory structure
- [ ] Create `src/i18n/translations/` subdirectory
- [ ] Create `src/i18n/scripts/` subdirectory
- [ ] Extract navigation & global strings from GlobalNavbar, Footer, Hero
- [ ] Extract assessment setup form strings from setup page, validation hooks
- [ ] Extract assessment engine UI strings from theme navigation, question components
- [ ] Extract authentication strings from PasswordPrompt, session components
- [ ] Extract API error messages from route handlers
- [ ] Extract metadata & SEO strings
- [ ] Create translation guide documentation
- [ ] Export question content from database to questions-en.json
- [ ] Create automation scripts for future updates

---

## Phase 2: Install & Configure next-intl

**Goal:** Set up i18n infrastructure with cookie-based locale detection.

### Dependencies

```bash
npm install next-intl
```

### Files to Create/Modify

1. **Configuration** (already in `src/i18n/` from Phase 1)
   - `src/i18n/config.ts` - Export supported locales, default locale, namespace paths
   - `src/i18n/request.ts` - Load translations from `src/i18n/translations/`, server-side locale detection

2. **Middleware**
   - Update `src/middleware.ts` - Add locale detection from cookie/header
   - Set locale cookie if not present
   - Preserve existing session validation

3. **Utilities**
   - Create `src/utils/locale.ts` - Cookie management functions
   - `setLocaleCookie(locale)`
   - `getLocaleFromCookie()`
   - `getLocaleFromHeader()`

4. **Context Updates**
   - Modify `src/contexts/LanguageContext.tsx` - Read from cookie, persist on change, trigger router refresh

5. **Provider Setup**
   - Create `src/components/Providers/LocaleProvider.tsx` - Wrap NextIntlClientProvider
   - Update `src/app/layout.tsx` - Add to provider stack

### Tasks

- [ ] Install next-intl package
- [ ] Create i18n configuration files
- [ ] Update middleware for locale detection
- [ ] Create locale utility functions
- [ ] Update LanguageContext for cookie persistence
- [ ] Create LocaleProvider component
- [ ] Add provider to app layout

**Verification:** Language selector sets cookie, page refreshes with new locale, cookie persists across sessions.

---

## Phase 3: Database Schema for Question Translations

**Goal:** Implement QuestionTranslation table for multilingual question content.

### Database Changes

#### New Entity: QuestionTranslation

```typescript
@Entity()
export class QuestionTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  questionId: string

  @ManyToOne('Question', 'translations')
  question: Question

  @Column()
  language: string  // 'en', 'es', 'fr', 'pt'

  @Column('text')
  questionText: string

  @Column('text', { nullable: true })
  definition: string | null

  @Column('text', { nullable: true })
  considerations: string | null

  @Column('jsonb', { nullable: true })
  followUpQuestions: any

  @Column('text', { nullable: true })
  strategyExamples: string | null

  @Column()
  keySuccessFactor: string

  @Column()
  minimalKeySuccessFactor: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

// Unique constraint: (questionId, language)
// Index on: language
```

#### Updated Entity: Question

Add relation:
```typescript
@OneToMany('QuestionTranslation', 'question', { cascade: true })
translations: QuestionTranslation[]
```

### Migration Strategy

1. Generate migration: `npm run migration:generate`
2. Review SQL for CREATE TABLE, indexes, foreign keys
3. Run migration on qa environment first
4. Verify table structure
5. Run migration on production when ready

### Seed Files

1. **003-question-translations-en.seed.ts**
   - Insert English translations for all 31 questions
   - Copy from existing Question table fields
   - Idempotent upsert pattern

2. **004-question-translations-es.seed.ts**
   - Template for Spanish translations
   - Populated after receiving translations from team
   - Uses data from `src/i18n/translations/questions-es.json`

### Tasks

- [ ] Create QuestionTranslation entity
- [ ] Update Question entity with translations relation
- [ ] Generate migration
- [ ] Update schema.dbml documentation
- [ ] Create English baseline seed file
- [ ] Create Spanish seed template
- [ ] Run migration on qa database
- [ ] Seed English translations
- [ ] Verify table and data


**Verification:** Table exists, 31 English translation records, foreign keys work, cascade delete works.

---

## Phase 4: Update Query Functions & API Routes

**Goal:** Modify data fetching to load localized question content.

### Query Function Updates

Update `src/db/queries/assessment-queries.ts`:

```typescript
// Add locale parameter to all question queries
export async function getQuestionsByDiagnostic(
  diagnosticId: string,
  locale: string = 'en'
): Promise<Question[]> {
  // LEFT JOIN question_translation WHERE language = locale
  // COALESCE(qt.question_text, q.question_text) AS question_text
  // Fallback to base Question if translation missing
}

export async function getQuestionsByTheme(
  diagnosticId: string,
  theme: Theme,
  locale: string = 'en'
): Promise<Question[]> { ... }

export async function getQuestionsWithAnswers(
  assessmentId: string,
  locale: string = 'en'
): Promise<QuestionWithAnswer[]> { ... }

export async function getCompleteQuestionData(
  assessmentId: string,
  questionId: string,
  locale: string = 'en'
): Promise<CompleteQuestionData> { ... }
```

### API Route Updates

1. **Theme Page Server Component** (`src/app/assessment/[id]/[theme]/page.tsx`)
   - Get current locale from `getLocale()` (next-intl)
   - Pass to `getQuestionsWithAnswers(assessmentId, locale)`

2. **Assessment Creation API** (`src/app/api/assessments/route.ts`)
   - Validate `language` field in request body
   - Ensure supported locale

3. **Answer APIs** (`src/app/api/assessments/[id]/answers/route.ts`)
   - Optionally return question text in response (for offline sync)
   - Localize error messages using server-side `getTranslations()`

### Tasks

- [ ] Add locale parameter to all question query functions
- [ ] Implement LEFT JOIN with QuestionTranslation
- [ ] Add COALESCE fallback logic for missing translations
- [ ] Update theme page to get and pass locale
- [ ] Update assessment creation API for locale validation
- [ ] Localize API error messages
- [ ] Update PlainQuestion interface documentation


**Verification:** Questions display in selected language, fallback to English works, no breaking changes.

---

## Phase 5: Update Components with Translations

**Goal:** Replace hardcoded strings with translation function calls.

### Component Updates

#### Navigation Components

1. **GlobalNavbar** (`src/components/GlobalNavbar.tsx`)
   ```typescript
   const t = useTranslations('navigation')
   
   <span>{t('brand')}</span>
   <Menu label={t('languageMenu')}>
     {languageOptions.map(lang => (
       <MenuItem>{t(`languages.${lang.code}`)}</MenuItem>
     ))}
   </Menu>
   ```

2. **Footer** (`src/components/Footer/index.tsx`)
   ```typescript
   const t = useTranslations('common')
   <Link>{t('footer.privacyPolicy')}</Link>
   <Link>{t('footer.termsOfService')}</Link>
   ```

#### Assessment Setup

3. **Setup Page** (`src/app/assessment/setup/page.tsx`)
   ```typescript
   const t = useTranslations('forms.setup')
   
   <label>{t('labels.diagnosticTitle')}</label>
   <input placeholder={t('placeholders.diagnosticTitle')} />
   ```

4. **Form Validation Hook** (`src/hooks/useAssessmentSetupForm.ts`)
   ```typescript
   const t = useTranslations('forms.setup')
   
   if (!title.trim()) {
     errors.diagnosticTitle = t('validation.titleRequired')
   }
   ```

#### Assessment Engine

5. **ThemeNavigation** (`src/app/assessment/[id]/[theme]/components/ThemeNavigation.tsx`)
   ```typescript
   const t = useTranslations('assessment.navigation')
   
   <h2>{t(`themes.${theme}`)}</h2>
   <span>{t('status.yes')}</span>
   <span>{t('progress', { answered, total })}</span>
   ```

6. **QuestionContent** (`src/app/assessment/[id]/[theme]/components/QuestionContent.tsx`)
   ```typescript
   const t = useTranslations('assessment.content')
   
   <h3>{t('headers.question')}</h3>
   <label>{t('headers.rationale')}</label>
   <TextEditor placeholder={t('placeholders.rationale')} />
   ```

7. **GuidanceSidebar** (`src/app/assessment/[id]/[theme]/components/GuidanceSidebar.tsx`)
   ```typescript
   const t = useTranslations('assessment.guidance')
   
   <Tab>{t('tabs.guidance')}</Tab>
   <Collapsible title={t('sections.definition')}>
     {definition || t('empty.definition')}
   </Collapsible>
   ```

8. **QuestionView** (`src/app/assessment/[id]/[theme]/components/QuestionView.tsx`)
   ```typescript
   const t = useTranslations('assessment.actions')
   
   <Button>{t('buttons.markComplete')}</Button>
   <Modal header={t('modal.markComplete.header')}>
     {t('modal.markComplete.content')}
   </Modal>
   ```

#### Authentication

9. **PasswordPrompt** (`src/components/assessment/PasswordPrompt.tsx`)
   ```typescript
   const t = useTranslations('auth')
   
   <Button>{t('buttons.resume')}</Button>
   {error && <ErrorMessage>{t(`errors.${error}`)}</ErrorMessage>}
   ```

#### Other Components

10. **AutoSaveIndicator** (`src/components/assessment/AutoSaveIndicator.tsx`)
11. **AnswerOptions** (`src/components/assessment/AnswerOptions.tsx`)
12. **Hero** (`src/components/static/Hero.tsx`)
13. **SubNavbar** (`src/app/assessment/[id]/[theme]/components/SubNavbar.tsx`)

### Layout & Metadata

14. **Root Layout** (`src/app/layout.tsx`)
    ```typescript
    export async function generateMetadata({ params }) {
      const locale = params.locale || 'en'
      const t = await getTranslations({ locale, namespace: 'metadata' })
      
      return {
        title: t('title'),
        description: t('description')
      }
    }
    ```

### Tasks

- [ ] Update GlobalNavbar with translations
- [ ] Update Footer with translations
- [ ] Update assessment setup form and validation
- [ ] Update theme navigation components
- [ ] Update question content components
- [ ] Update guidance sidebar
- [ ] Update QuestionView wrapper
- [ ] Update authentication components
- [ ] Update additional UI components
- [ ] Update API routes for localized messages
- [ ] Update layout metadata


**Verification:** All UI text comes from translation files, language switching works across all pages, no hardcoded strings remain.

---

## Phase 6: Testing & Quality Assurance

**Goal:** Ensure translations work correctly across all scenarios.

### Test Files to Create/Update

1. **Utility Tests**
   - `src/utils/__tests__/locale.test.ts` - Cookie functions, fallback logic
   - `src/i18n/__tests__/request.test.ts` - Translation loading, locale detection

2. **Component Tests**
   - Update all existing component tests to wrap with `NextIntlClientProvider`
   - Provide mock translations
   - Test language switching behavior

3. **Integration Tests**
   - `src/__tests__/i18n-navigation.integration.test.ts` - Full navigation flow with locale switching

4. **Database Tests**
   - `src/db/entities/__tests__/QuestionTranslation.entity.test.ts` - Entity constraints, relations
   - Update `assessment-queries.ts` tests for locale parameter

### Manual Testing Checklist

- [ ] Language switcher works on all routes
- [ ] Cookie persists across browser close/reopen
- [ ] Browser language auto-detection works
- [ ] Form validation messages appear in selected language
- [ ] Question content loads in Spanish (after seed)
- [ ] Auto-save works with localized UI
- [ ] Screen reader announces localized text
- [ ] Missing translations fallback gracefully
- [ ] No hydration errors (SSR matches client)
- [ ] Page load time <3s with translations
- [ ] No bundle size regressions

### Performance Testing

- [ ] Measure translation file load time
- [ ] Verify only one locale loaded at a time
- [ ] Check for unnecessary re-renders on language switch
- [ ] Profile memory usage

### Tasks

- [ ] Create i18n utility tests
- [ ] Create translation loading tests
- [ ] Update existing component tests
- [ ] Create integration tests
- [ ] Create question translation entity tests
- [ ] Complete manual testing checklist
- [ ] Run performance tests
- [ ] Fix any bugs discovered


**Verification:** All tests pass, no regressions, translations work in all scenarios, performance requirements met.

---

## Phase 7: Documentation & Handoff

**Goal:** Document the i18n system for future maintenance.

### Documentation Files

1. **Developer Guide** (`docs/I18N_DEVELOPER_GUIDE.md`)
   - How to add new translation keys
   - How to use `useTranslations` hook
   - How to handle pluralization and ICU MessageFormat
   - How to test components with translations
   - How to add a new language

2. **Translation Workflow** (`docs/TRANSLATION_WORKFLOW.md`)
   - How to extract new strings when adding features
   - How to request translations from team
   - How to import completed translations
   - How to verify translation quality
   - How to handle translation updates

3. **Translation Guide** (`docs/TRANSLATION_GUIDE.md`)
   - For translators: JSON structure, placeholders, context
   - Character limits for UI constraints
   - Pluralization examples
   - Cultural considerations

4. **Translation Status** (`docs/TRANSLATION_STATUS.md`)
   - Completion % per language
   - Last updated dates
   - Contact info for translators

### NPM Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "i18n:extract-ui": "tsx src/i18n/scripts/extract-ui-strings.ts",
    "i18n:validate": "tsx src/i18n/scripts/validate-translations.ts",
    "i18n:export-questions": "tsx src/i18n/scripts/sync-translations.ts --export",
    "i18n:import-questions": "tsx src/i18n/scripts/sync-translations.ts --import",
    "i18n:import-csv": "tsx src/i18n/scripts/import-question-csv.ts",
    "i18n:sync": "tsx src/i18n/scripts/sync-translations.ts"
  }
}
```

### Update Existing Docs

- [ ] Update `coding-agent.md` with i18n section
- [ ] Add QuestionTranslation to entity list
- [ ] Document supported locales
- [ ] Add translation key conventions
- [ ] Update "Current Status" section

### Tasks

- [ ] Create I18N_DEVELOPER_GUIDE.md
- [ ] Create TRANSLATION_WORKFLOW.md
- [ ] Create TRANSLATION_GUIDE.md
- [ ] Create TRANSLATION_STATUS.md
- [ ] Add npm scripts for i18n management (already in Phase 1/8)
- [ ] Update coding-agent.md
- [ ] Add comments to seed files
- [ ] Document automation scripts in TRANSLATION_WORKFLOW.md


**Verification:** Documentation is clear, new developers can implement i18n features, translators have clear instructions.

---

## Phase 8: Automated Workflow for Stakeholder Changes

**Goal:** Create tooling and processes to handle translation updates from stakeholders without manual intervention or AI prompting.

### Problem Statement

Stakeholders (WRI team, translators) will provide updated translations via:
- Updated CSV files with question translations
- Modified JSON files with UI string translations
- Email/document with specific translation changes

**Requirements:**
- Update QuestionTranslation table in database automatically
- Update translation JSON files automatically
- Validate changes before applying
- Track what changed and who changed it
- No need to prompt AI agents for routine updates

---

### Solution: Automated Import/Sync Scripts

#### Script 1: CSV Question Import (`src/i18n/scripts/import-question-csv.ts`)

**Purpose:** Import question translations from updated CSV files (like the ones in `docs/resources/`)

**Features:**
- Read CSV with columns: questionCode, language, questionText, definition, considerations, followUpQuestions, strategyExamples, keySuccessFactor, minimalKeySuccessFactor
- Validate question codes match existing questions in DB
- Sanitize text content (remove bullets, normalize quotes, etc.)
- Parse followUpQuestions JSON
- Upsert into QuestionTranslation table
- Generate diff report of what changed
- Rollback on validation errors

**Usage:**
```bash
# Import Spanish translations from CSV
npm run i18n:import-csv -- --file docs/resources/questions-es.csv --language es

# Dry run to preview changes
npm run i18n:import-csv -- --file docs/resources/questions-es.csv --language es --dry-run

# Force overwrite even if existing translations found
npm run i18n:import-csv -- --file docs/resources/questions-es.csv --language es --force
```

**Implementation:**
```typescript
// src/i18n/scripts/import-question-csv.ts
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { initializeDatabase } from '@/db/data-source'
import { Question } from '@/db/entities/Question.entity'
import { QuestionTranslation } from '@/db/entities/QuestionTranslation.entity'
import { sanitizeText, parseFollowUpQuestions } from '@/db/seeds/utils/sanitize-text'

interface CSVRow {
  questionCode: string
  language: string
  questionText: string
  definition: string
  considerations: string
  followUpQuestions: string
  strategyExamples: string
  keySuccessFactor: string
  minimalKeySuccessFactor: string
}

async function importQuestionsFromCSV(
  filePath: string,
  language: string,
  options: { dryRun?: boolean; force?: boolean }
) {
  // Initialize DB
  const dataSource = await initializeDatabase()
  const queryRunner = dataSource.createQueryRunner()
  
  try {
    // Read and parse CSV
    const fileContent = readFileSync(filePath, 'utf-8')
    const rows: CSVRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    })
    
    console.log(`Found ${rows.length} rows in CSV`)
    
    // Start transaction
    await queryRunner.startTransaction()
    
    const changes: Array<{code: string; action: 'insert' | 'update'; field: string}> = []
    
    for (const row of rows) {
      // Find existing question by code
      const question = await queryRunner.manager.findOne(Question, {
        where: { questionCode: row.questionCode }
      })
      
      if (!question) {
        console.warn(`Question ${row.questionCode} not found in database, skipping`)
        continue
      }
      
      // Check for existing translation
      const existing = await queryRunner.manager.findOne(QuestionTranslation, {
        where: { questionId: question.id, language }
      })
      
      // Prepare sanitized data
      const translationData = {
        questionId: question.id,
        language,
        questionText: sanitizeText(row.questionText),
        definition: row.definition ? sanitizeText(row.definition) : null,
        considerations: row.considerations ? sanitizeText(row.considerations) : null,
        followUpQuestions: row.followUpQuestions ? parseFollowUpQuestions(row.followUpQuestions) : null,
        strategyExamples: row.strategyExamples ? sanitizeText(row.strategyExamples) : null,
        keySuccessFactor: sanitizeText(row.keySuccessFactor),
        minimalKeySuccessFactor: sanitizeText(row.minimalKeySuccessFactor)
      }
      
      if (existing) {
        // Track what changed
        Object.keys(translationData).forEach(key => {
          if (JSON.stringify(existing[key]) !== JSON.stringify(translationData[key])) {
            changes.push({ code: row.questionCode, action: 'update', field: key })
          }
        })
        
        if (!options.force && changes.length === 0) {
          console.log(`${row.questionCode}: No changes`)
          continue
        }
        
        // Update existing
        await queryRunner.manager.update(QuestionTranslation, existing.id, translationData)
        console.log(`${row.questionCode}: Updated`)
      } else {
        // Insert new
        await queryRunner.manager.save(QuestionTranslation, translationData)
        changes.push({ code: row.questionCode, action: 'insert', field: 'all' })
        console.log(`${row.questionCode}: Inserted`)
      }
    }
    
    if (options.dryRun) {
      console.log('\\nDRY RUN - Rolling back changes\\n')
      await queryRunner.rollbackTransaction()
    } else {
      await queryRunner.commitTransaction()
      console.log('\\nTransaction committed\\n')
    }
    
    // Print summary
    console.log(`Summary:`)
    console.log(`- Inserted: ${changes.filter(c => c.action === 'insert').length}`)
    console.log(`- Updated: ${changes.filter(c => c.action === 'update').length}`)
    console.log(`- Total changes: ${changes.length}`)
    
    return changes
    
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw error
  } finally {
    await queryRunner.release()
  }
}
```

---

#### Script 2: Bidirectional Sync (`src/i18n/scripts/sync-translations.ts`)

**Purpose:** Sync translations between database and JSON files in both directions

**Features:**
- Export: QuestionTranslation table → `src/i18n/translations/questions-{locale}.json`
- Import: `src/i18n/translations/questions-{locale}.json` → QuestionTranslation table
- Detect conflicts (DB newer than JSON or vice versa)
- Generate changelog
- Atomic operations (all or nothing)

**Usage:**
```bash
# Export all languages from DB to JSON files
npm run i18n:export-questions

# Export specific language
npm run i18n:export-questions -- --language es

# Import JSON files to database
npm run i18n:import-questions

# Import specific language
npm run i18n:import-questions -- --language es

# Bidirectional sync (detect conflicts)
npm run i18n:sync

# Force direction (resolve conflicts by preferring source)
npm run i18n:sync -- --prefer-db
npm run i18n:sync -- --prefer-json
```

**Implementation:**
```typescript
// src/i18n/scripts/sync-translations.ts
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { initializeDatabase } from '@/db/data-source'
import { Question } from '@/db/entities/Question.entity'
import { QuestionTranslation } from '@/db/entities/QuestionTranslation.entity'

interface QuestionTranslationJSON {
  [questionCode: string]: {
    questionText: string
    definition: string | null
    considerations: string | null
    followUpQuestions: any
    strategyExamples: string | null
    keySuccessFactor: string
    minimalKeySuccessFactor: string
    lastUpdated: string
  }
}

async function exportToJSON(language: string): Promise<void> {
  const dataSource = await initializeDatabase()
  
  const translations = await dataSource.getRepository(QuestionTranslation)
    .createQueryBuilder('qt')
    .leftJoinAndSelect('qt.question', 'q')
    .where('qt.language = :language', { language })
    .orderBy('q.sortOrder', 'ASC')
    .getMany()
  
  const json: QuestionTranslationJSON = {}
  
  translations.forEach(t => {
    json[t.question.questionCode] = {
      questionText: t.questionText,
      definition: t.definition,
      considerations: t.considerations,
      followUpQuestions: t.followUpQuestions,
      strategyExamples: t.strategyExamples,
      keySuccessFactor: t.keySuccessFactor,
      minimalKeySuccessFactor: t.minimalKeySuccessFactor,
      lastUpdated: t.updatedAt.toISOString()
    }
  })
  
  const filePath = `src/i18n/translations/questions-${language}.json`
  writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8')
  console.log(`Exported ${translations.length} translations to ${filePath}`)
}

async function importFromJSON(language: string): Promise<void> {
  const filePath = `src/i18n/translations/questions-${language}.json`
  
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }
  
  const json: QuestionTranslationJSON = JSON.parse(readFileSync(filePath, 'utf-8'))
  const dataSource = await initializeDatabase()
  const queryRunner = dataSource.createQueryRunner()
  
  await queryRunner.startTransaction()
  
  try {
    for (const [questionCode, data] of Object.entries(json)) {
      const question = await queryRunner.manager.findOne(Question, {
        where: { questionCode }
      })
      
      if (!question) {
        console.warn(`Question ${questionCode} not found, skipping`)
        continue
      }
      
      await queryRunner.manager.upsert(QuestionTranslation, {
        questionId: question.id,
        language,
        ...data
      }, ['questionId', 'language'])
      
      console.log(`${questionCode}: Synced`)
    }
    
    await queryRunner.commitTransaction()
    console.log(`Imported ${Object.keys(json).length} translations from ${filePath}`)
    
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw error
  } finally {
    await queryRunner.release()
  }
}
```

---

#### Script 3: UI String Extraction (`src/i18n/scripts/extract-ui-strings.ts`)

**Purpose:** Extract hardcoded strings from React components and update translation JSON files

**Features:**
- Scan components for hardcoded text
- Suggest translation keys
- Update en.json with new keys
- Preserve existing translations
- Generate report of untranslated strings

**Usage:**
```bash
# Scan all components
npm run i18n:extract-ui

# Scan specific directory
npm run i18n:extract-ui -- --path src/components/assessment

# Interactive mode (prompts for each string)
npm run i18n:extract-ui -- --interactive
```

---

#### Script 4: Validation (`src/i18n/scripts/validate-translations.ts`)

**Purpose:** Validate translation completeness and consistency

**Features:**
- Check all translation files have same keys
- Verify no missing translations
- Check for placeholder mismatches
- Validate ICU MessageFormat syntax
- Ensure all questions have translations in all languages
- Generate coverage report

**Usage:**
```bash
# Validate all languages
npm run i18n:validate

# Validate specific language
npm run i18n:validate -- --language es

# Check question translations only
npm run i18n:validate -- --questions-only

# CI mode (exit code 1 if validation fails)
npm run i18n:validate -- --ci
```

**Implementation:**
```typescript
// src/i18n/scripts/validate-translations.ts
import { readFileSync, readdirSync } from 'fs'
import { initializeDatabase } from '@/db/data-source'
import { QuestionTranslation } from '@/db/entities/QuestionTranslation.entity'

async function validateTranslations() {
  const errors: string[] = []
  const warnings: string[] = []
  
  // 1. Validate UI translation files
  const translationFiles = readdirSync('src/i18n/translations')
    .filter(f => f.endsWith('.json') && !f.startsWith('questions-'))
  
  const locales = translationFiles.map(f => f.replace('.json', ''))
  const translationData: Record<string, any> = {}
  
  locales.forEach(locale => {
    translationData[locale] = JSON.parse(
      readFileSync(`src/i18n/translations/${locale}.json`, 'utf-8')
    )
  })
  
  // Check all locales have same keys
  const baseKeys = getAllKeys(translationData[locales[0]])
  
  locales.slice(1).forEach(locale => {
    const keys = getAllKeys(translationData[locale])
    const missing = baseKeys.filter(k => !keys.includes(k))
    const extra = keys.filter(k => !baseKeys.includes(k))
    
    if (missing.length > 0) {
      errors.push(`${locale}: Missing keys: ${missing.join(', ')}`)
    }
    if (extra.length > 0) {
      warnings.push(`${locale}: Extra keys: ${extra.join(', ')}`)
    }
  })
  
  // 2. Validate question translations in database
  const dataSource = await initializeDatabase()
  const expectedQuestions = 31
  const supportedLocales = ['en', 'es'] // from config
  
  for (const locale of supportedLocales) {
    const count = await dataSource.getRepository(QuestionTranslation)
      .count({ where: { language: locale } })
    
    if (count < expectedQuestions) {
      errors.push(`${locale}: Only ${count}/${expectedQuestions} question translations found`)
    } else if (count > expectedQuestions) {
      warnings.push(`${locale}: ${count}/${expectedQuestions} question translations (more than expected)`)
    }
  }
  
  // 3. Print report
  console.log('\\n=== Translation Validation Report ===\\n')
  
  if (errors.length > 0) {
    console.error('Errors:')
    errors.forEach(e => console.error(`  ❌ ${e}`))
  }
  
  if (warnings.length > 0) {
    console.warn('\\nWarnings:')
    warnings.forEach(w => console.warn(`  ⚠️  ${w}`))
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All translations valid!')
  }
  
  // Exit with error code for CI
  if (process.argv.includes('--ci') && errors.length > 0) {
    process.exit(1)
  }
}

function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = []
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  })
  return keys
}
```

---

### Workflow: Handling New CSV from Stakeholders

**Scenario:** WRI team sends updated CSV with Spanish question translations

**Steps (Developer):**

1. **Save CSV file**
   ```bash
   # Place file in docs/resources/
   docs/resources/questions-es-updated-2026-03-15.csv
   ```

2. **Preview changes (dry run)**
   ```bash
   npm run i18n:import-csv -- \\
     --file docs/resources/questions-es-updated-2026-03-15.csv \\
     --language es \\
     --dry-run
   ```
   - Reviews console output showing what will change
   - Checks for validation errors

3. **Import to database**
   ```bash
   npm run i18n:import-csv -- \\
     --file docs/resources/questions-es-updated-2026-03-15.csv \\
     --language es
   ```
   - Updates QuestionTranslation table
   - Prints summary of changes

4. **Export to JSON (for version control)**
   ```bash
   npm run i18n:export-questions -- --language es
   ```
   - Updates `src/i18n/translations/questions-es.json`
   - Commit this file to git for tracking

5. **Validate everything**
   ```bash
   npm run i18n:validate
   ```
   - Ensures all 31 questions have Spanish translations
   - Checks consistency

6. **Test in application**
   ```bash
   npm run dev
   # Switch to Spanish, navigate through questions
   ```

7. **Commit changes**
   ```bash
   git add docs/resources/questions-es-updated-2026-03-15.csv
   git add src/i18n/translations/questions-es.json
   git commit -m "chore(i18n): Update Spanish question translations from WRI team"
   ```

**Total Time:** ~10-15 minutes (no AI prompting needed!)

---

### Workflow: Updating UI Translation Values

**Scenario:** Translator updates a specific value in `src/i18n/translations/es.json`

**Steps (Developer or Translator):**

1. **Edit JSON file directly**
   ```json
   // src/i18n/translations/es.json
   {
     "common": {
       "buttons": {
         "continue": "Continuar",  // Changed from "Seguir"
         "save": "Guardar"
       }
     }
   }
   ```

2. **Validate changes**
   ```bash
   npm run i18n:validate
   ```
   - Ensures JSON is valid
   - Checks all keys still present

3. **Test in application**
   ```bash
   npm run dev
   # Switch to Spanish, click Continue button
   ```

4. **Commit**
   ```bash
   git add src/i18n/translations/es.json
   git commit -m "chore(i18n): Update Spanish 'continue' button text"
   ```

**Total Time:** ~2-3 minutes

---

### Workflow: Bulk Update All Translations

**Scenario:** Major translation revision across all languages

**Steps:**

1. **Export current state to JSON**
   ```bash
   npm run i18n:export-questions
   ```

2. **Send JSON files to translators**
   - `src/i18n/translations/questions-es.json`
   - `src/i18n/translations/es.json`

3. **Translators edit JSON files**
   - Use any text editor or specialized tool
   - Preserve JSON structure
   - Change only values, not keys

4. **Developer receives updated files**
   - Replace files in `src/i18n/translations/`

5. **Import questions back to DB**
   ```bash
   npm run i18n:import-questions -- --language es
   ```

6. **Validate**
   ```bash
   npm run i18n:validate
   ```

7. **Test and commit**

---

### CI/CD Integration

**GitHub Actions workflow for validation:**

```yaml
# .github/workflows/validate-i18n.yml
name: Validate Translations

on:
  pull_request:
    paths:
      - 'src/i18n/translations/**'
      - 'docs/resources/questions-*.csv'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run i18n:validate -- --ci
```

**Benefits:**
- Automatic validation on every PR
- Prevents merging incomplete translations
- Catches JSON syntax errors
- Ensures consistency

---

### Tasks

- [ ] Create `src/i18n/scripts/import-question-csv.ts`
- [ ] Create `src/i18n/scripts/sync-translations.ts`
- [ ] Create `src/i18n/scripts/extract-ui-strings.ts`
- [ ] Create `src/i18n/scripts/validate-translations.ts`
- [ ] Add npm scripts to package.json
- [ ] Document workflows in TRANSLATION_WORKFLOW.md
- [ ] Create GitHub Actions workflow for CI validation
- [ ] Test all workflows with sample data
- [ ] Train team on using scripts


**Verification:** Developer can import CSV, sync translations, and validate without AI assistance. Changes tracked in git. CI catches errors automatically.

---

## Timeline & Milestones

### Sprint 1: Foundation (Week 1)
- Phase 1: Create translation JSON files and directory structure
- Phase 2: Install and configure next-intl
- **Milestone:** Language switcher sets cookie, loads English translations

### Sprint 2: Database & Queries (Week 2)
- Phase 3: Database schema for question translations
- Phase 4: Update query functions and API routes
- **Milestone:** Questions can be fetched in multiple languages

### Sprint 3: Component Integration (Weeks 3-4)
- Phase 5: Update all components with translations
- **Milestone:** All UI text comes from translation files

### Sprint 4: Testing & Documentation (Week 5)
- Phase 6: Testing and quality assurance
- Phase 7: Documentation and handoff
- **Milestone:** Production-ready i18n system, Spanish support live

### Sprint 5: Automation & Workflow (Week 6)
- Phase 8: Create automated scripts for stakeholder-driven updates
- **Milestone:** Team can import CSV, update translations, and validate without developer intervention

**Total Duration:** 6 weeks (assuming single developer)
**Critical Path:** Phases 1-5 must complete before production deployment
**Post-MVP:** Phases 7-8 can be implemented after initial Spanish release

---

## Success Criteria

### Functional Requirements
- ✅ User can switch language via navbar on any page
- ✅ Language preference persists across browser sessions
- ✅ All UI text translates when language changes
- ✅ All 31 question contents translate (after Spanish translations received)
- ✅ Form validation messages appear in selected language
- ✅ API error messages appear in selected language
- ✅ Auto-save continues to work with translations
- ✅ New language (French/Portuguese) can be added quicker

### Technical Requirements
- ✅ Page load time remains <3s on 3G
- ✅ No hydration errors
- ✅ SSR works correctly with translations
- ✅ Test coverage >90% for new i18n code
- ✅ Bundle size increase <100KB
- ✅ TypeScript types for translation keys
- ✅ No regressions in existing functionality

### Documentation Requirements
- ✅ Developer guide explains how to add translations
- ✅ Translation workflow documented for non-technical team
- ✅ All translation keys have English baseline
- ✅ Translation status tracking in place
- ✅ Automated scripts documented and tested
- ✅ CSV import workflow documented
- ✅ CI/CD validation configured


---


## Resources

### External Documentation
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js 15 i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU MessageFormat Syntax](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

### Internal Files
- Translation JSON: `src/i18n/translations/*.json`
- Question translations: `src/i18n/translations/questions-*.json`
- i18n config: `src/i18n/config.ts`
- i18n request: `src/i18n/request.ts`
- Automation scripts: `src/i18n/scripts/*.ts`
- Locale utilities: `src/utils/locale.ts`
- Translation tables: `src/db/entities/QuestionTranslation.entity.ts`

---

## Appendix A: Translation Key Naming Conventions

### Pattern
```
{namespace}.{category}.{identifier}
```

### Examples
```
navigation.brand
navigation.themes.motivate
forms.setup.labels.diagnosticTitle
forms.setup.validation.titleRequired
assessment.content.headers.question
assessment.guidance.tabs.guidance
auth.errors.passwordRequired
errors.api.invalidEmail
```

### Rules
- Use camelCase for identifiers
- Maximum 4 levels of nesting
- Group related keys together
- Use descriptive names (not generic like `label1`, `error2`)
- Prefix boolean-related keys with `is`/`has`
- Use verbs for actions (`save`, `continue`, `cancel`)

---

## Appendix B: ICU MessageFormat Examples

### Simple Placeholder
```json
{
  "welcome": "Welcome, {name}!"
}
```
```typescript
t('welcome', { name: 'John' })
// Output: "Welcome, John!"
```

### Pluralization
```json
{
  "items": "{count, plural, =0 {No items} =1 {One item} other {# items}}"
}
```
```typescript
t('items', { count: 0 })  // "No items"
t('items', { count: 1 })  // "One item"
t('items', { count: 5 })  // "5 items"
```

### Select (Gender/Options)
```json
{
  "status": "{status, select, yes {Yes} no {No} partly {Partly} na {N/A} other {Unknown}}"
}
```

### Date/Time Formatting
```json
{
  "lastSaved": "Last saved: {date, date, short} at {date, time, short}"
}
```
```typescript
t('lastSaved', { date: new Date() })
// Output: "Last saved: 2/26/26 at 3:45 PM"
```

---

**End of Plan**
