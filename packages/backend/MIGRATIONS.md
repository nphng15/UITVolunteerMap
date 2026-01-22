# Database Migrations

## Start

```bash
# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration from entity changes
npm run migration:generate -- src/db/migrations/MigrationName

# Create empty migration
npm run migration:create -- src/db/migrations/MigrationName

# Import seed (database insertion)
npm run seed
```

## Workflow

### 1. Modify Entities
Update your entity files in `src/entities/`

### 2. Generate Migration
```bash
npm run migration:generate -- src/db/migrations/AddUserPhone
```

### 3. Review Generated Migration
Check the migration file in `src/db/migrations/` before running

### 4. Run Migration
```bash
npm run migration:run
```

### 5. Rollback (if needed)
```bash
npm run migration:revert
```

## Best Practices

- Always review generated migrations before running
- Test migrations in development first
- Never modify migrations that have been deployed
- Use descriptive migration names
- Commit migrations with related entity changes

## Database Location

Development: `src/data/database.sqlite`
