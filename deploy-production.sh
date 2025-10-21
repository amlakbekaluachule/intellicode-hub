#!/bin/bash

echo "🚀 Deploying IntelliCode Hub to Production"

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Build backend
echo "Building backend..."
cd backend
npm run build
cd ..

# Build Docker images
echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build

# Deploy
echo "Deploying to production..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Production deployment complete!"
