#!/bin/bash

echo "🚀 Starting IntelliCode Hub Development Environment"

# Start database services
echo "Starting database services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ IntelliCode Hub is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "Database: localhost:5432"
echo "Redis: localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
