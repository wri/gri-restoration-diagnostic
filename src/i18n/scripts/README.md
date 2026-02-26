# i18n Automation Scripts

This directory contains automated scripts for managing translation workflows without requiring AI assistance.

## Scripts

### 1. `import-question-csv.ts`

Import question translations from CSV files (like those provided by WRI stakeholders).

**Features:**
- Maps CSV rows to question codes (M01-M08, E01-E13, I01-I10)
- Validates questions exist in database
- Sanitizes text content (bullets, quotes, formatting)
- Parses follow-up questions into JSON
- Shows detailed diff of changes
- Transactional (all-or-nothing)
- Dry-run mode for preview

**Usage:**

```bash
# Preview changes without applying them
npm run i18n:import-csv -- --file docs/resources/questions.csv --dry-run

# Import and apply changes
npm run i18n:import-csv -- --file docs/resources/questions.csv

# Force update even if no changes detected
npm run i18n:import-csv -- --file docs/resources/questions.csv --force
```

**CSV Format Expected:**

```csv
id,Theme,Enabling condition,Minimal,Key Factor,Question,Definition,Guidance,Follow up question(s),Examples of strategies to address gap in key factor
1,Motivate,Benefits,Economic,Restoration generates economic benefits,"Is restoring...",..."
```

- `id` column maps to question codes:
  - 1-8 → M01-M08 (Motivate)
  - 9-21 → E01-E13 (Enable)  
  - 22-31 → I01-I10 (Implement)

### 2. `sync-translations.ts`

Bidirectional sync between database and JSON files.

**Features:**
- Export questions from DB to JSON (for version control)
- Import questions from JSON to DB (for bulk updates)
- Preserves question order
- Includes metadata (lastUpdated)

**Usage:**

```bash
# Export all questions to src/i18n/translations/questions-en.json
npm run i18n:export-questions

# Export with specific language (when multi-language support added)
npm run i18n:export-questions -- --language es

# Import from JSON files back to database
npm run i18n:import-questions

# Import specific language
npm run i18n:import-questions -- --language es
```

### 3. `validate-translations.ts`

Validate translation completeness and consistency.

**Features:**
- Checks all 31 questions exist
- Validates JSON files are valid
- Checks for missing content
- Generates coverage report
- CI mode (exits with error code if validation fails)

**Usage:**

```bash
# Validate all translations
npm run i18n:validate

# Check questions only (skip UI strings)
npm run i18n:validate -- --questions-only

# CI mode (for GitHub Actions)
npm run i18n:validate -- --ci
```

## Workflows

### Workflow 1: Import CSV from Stakeholders

**Scenario:** WRI team sends updated CSV with question content

**Steps:**

1. **Save CSV File**
   ```bash
   # Place in docs/resources/
   docs/resources/questions-update-2026-02-26.csv
   ```

2. **Preview Changes**
   ```bash
   npm run i18n:import-csv -- \
     --file docs/resources/questions-update-2026-02-26.csv \
     --dry-run
   ```
   
   Review console output showing:
   - Which questions will be updated
   - What fields changed
   - Old vs. new values

3. **Apply Changes**
   ```bash
   npm run i18n:import-csv -- \
     --file docs/resources/questions-update-2026-02-26.csv
   ```

4. **Export to JSON** (for version control)
   ```bash
   npm run i18n:export-questions
   ```
   
   This updates `src/i18n/translations/questions-en.json`

5. **Validate**
   ```bash
   npm run i18n:validate
   ```

6. **Test in Application**
   ```bash
   npm run dev
   # Navigate through questions to verify updates
   ```

7. **Commit Changes**
   ```bash
   git add docs/resources/questions-update-2026-02-26.csv
   git add src/i18n/translations/questions-en.json
   git commit -m "chore(i18n): Update question content from WRI team"
   ```

**Time:** ~10-15 minutes

### Workflow 2: Bulk JSON Edit

**Scenario:** Manual editing of question content

**Steps:**

1. **Export Current State**
   ```bash
   npm run i18n:export-questions
   ```

2. **Edit JSON File**
   - Open `src/i18n/translations/questions-en.json`
   - Make changes (preserve structure)
   - Save file

3. **Import Back to Database**
   ```bash
   npm run i18n:import-questions
   ```

4. **Validate**
   ```bash
   npm run i18n:validate
   ```

5. **Test & Commit**

**Time:** ~5-10 minutes

## CSV to Question Code Mapping

The CSV `id` column maps to database question codes:

| CSV ID | Code | Theme      |
|--------|------|------------|
| 1      | M01  | Motivate   |
| 2      | M02  | Motivate   |
| ...    | ...  | ...        |
| 8      | M08  | Motivate   |
| 9      | E01  | Enable     |
| ...    | ...  | ...        |
| 21     | E13  | Enable     |
| 22     | I01  | Implement  |
| ...    | ...  | ...        |
| 31     | I10  | Implement  |

## Text Sanitization

All scripts use the same sanitization utilities from `src/db/seeds/utils/sanitize-text.ts`:

- **Bullets:** Converts `•` to newlines, removes list prefixes
- **Quotes:** Normalizes smart quotes to standard quotes  
- **Whitespace:** Trims and normalizes spacing
- **Follow-up Questions:** Parses into structured JSON:
  ```json
  {
    "if yes": ["Question 1", "Question 2"],
    "if no": ["Question 3"]
  }
  ```

## Error Handling

All scripts:
- Use database transactions (rollback on error)
- Validate input before processing
- Provide detailed error messages
- Exit with appropriate codes for CI/CD

## CI/CD Integration

Add to `.github/workflows/validate-i18n.yml`:

```yaml
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

## Dependencies

- `csv-parse`: CSV parsing
- `typeorm`: Database operations
- `ts-node`: TypeScript execution
- `dotenv`: Environment variables

## Troubleshooting

**Issue:** "Question not found in database"
- **Cause:** CSV `id` doesn't map to a valid question code
- **Fix:** Check the mapping table above

**Issue:** "Invalid JSON"
- **Cause:** Malformed JSON in translation files
- **Fix:** Run `npm run i18n:validate` to identify the issue

**Issue:** "Transaction rollback"
- **Cause:** Database error during import
- **Fix:** Check database logs, ensure connection is active

## Future Enhancements

When Spanish support is added (Phase 3 of i18n plan):

1. Create `QuestionTranslation` entity
2. Update scripts to use `--language` parameter
3. Support multiple CSV imports (one per language)
4. Validate all languages have complete translations
