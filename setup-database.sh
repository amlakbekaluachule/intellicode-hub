#!/bin/bash

echo "🗄️  Setting up database..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "Starting PostgreSQL..."
    brew services start postgresql
    sleep 3
fi

# Create database
createdb intellicode_hub 2>/dev/null || echo "Database already exists"

# Run migrations
cd backend
npx prisma migrate dev --name init
npx prisma generate

echo "✅ Database setup complete!"
