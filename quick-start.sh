#!/bin/bash

echo "🚀 IntelliCode Hub - Quick Start"
echo "================================"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Environment file not found. Please run setup.sh first"
    exit 1
fi

# Start services
echo "Starting database services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services
echo "Waiting for services..."
sleep 5

# Start application
echo "Starting IntelliCode Hub..."
npm run dev

echo "✅ IntelliCode Hub is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
