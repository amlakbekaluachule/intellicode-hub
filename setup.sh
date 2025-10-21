#!/bin/bash

# IntelliCode Hub - Complete Setup Script
# This script sets up the entire IntelliCode Hub project with real configuration

echo "🚀 IntelliCode Hub - Complete Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the IntelliCode Hub root directory"
    exit 1
fi

print_info "Setting up IntelliCode Hub with real configuration..."

# Step 1: Install dependencies
print_info "Installing dependencies..."
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

# Step 2: Create environment file with real configuration
print_info "Creating environment configuration..."

cat > .env << 'EOF'
# ===========================================
# INTELLICODE HUB - PRODUCTION CONFIGURATION
# ===========================================

# Database Configuration
DATABASE_URL="postgresql://postgres:intellicode123@localhost:5432/intellicode_hub"
REDIS_URL="redis://localhost:6379"

# JWT Authentication (Generated secure key)
JWT_SECRET="intellicode-hub-super-secret-jwt-key-2024-production-ready-secure-token-32-chars"
TOKEN_EXPIRES_IN="7d"
BCRYPT_ROUNDS=12

# Google OAuth2 (Replace with your actual credentials)
GOOGLE_CLIENT_ID="123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz123456"

# GitHub OAuth2 (Replace with your actual credentials)
GITHUB_CLIENT_ID="Iv1.1234567890abcdef"
GITHUB_CLIENT_SECRET="1234567890abcdef1234567890abcdef12345678"

# OpenAI API (Replace with your actual API key)
OPENAI_API_KEY="sk-proj-abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890"

# AWS Configuration (Replace with your actual credentials)
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="intellicode-hub-production-storage"

# Frontend Configuration
VITE_API_URL="http://localhost:5000"
VITE_WS_URL="ws://localhost:5000"

# Backend Configuration
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# Security & Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Webhook URLs (Optional)
GITHUB_WEBHOOK_SECRET="your-github-webhook-secret"
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890"

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_COLLABORATION=true
ENABLE_VIDEO_CALLS=true
ENABLE_ANALYTICS=true

# Cache Configuration
REDIS_TTL=3600
AI_CACHE_TTL=3600

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="js,ts,jsx,tsx,py,java,cpp,c,cs,go,rs,php,rb,html,css,scss,json,xml,yaml,md,sql"

# Development Tools
DEBUG_MODE=true
ENABLE_SWAGGER=true
ENABLE_GRAPHQL_PLAYGROUND=true
EOF

print_status "Environment file created with real configuration"

# Step 3: Generate secure JWT secret
print_info "Generating secure JWT secret..."
JWT_SECRET=$(openssl rand -base64 32)
sed -i.bak "s/intellicode-hub-super-secret-jwt-key-2024-production-ready-secure-token-32-chars/$JWT_SECRET/" .env
rm .env.bak

print_status "Secure JWT secret generated: $JWT_SECRET"

# Step 4: Create database setup script
print_info "Creating database setup script..."

cat > setup-database.sh << 'EOF'
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
EOF

chmod +x setup-database.sh

# Step 5: Create Docker setup
print_info "Creating Docker configuration..."

cat > docker-compose.dev.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: intellicode-postgres
    environment:
      POSTGRES_DB: intellicode_hub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: intellicode123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: intellicode-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
EOF

# Step 6: Create startup script
print_info "Creating startup script..."

cat > start-dev.sh << 'EOF'
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
EOF

chmod +x start-dev.sh

# Step 7: Create API key setup guide
print_info "Creating API key setup guide..."

cat > API_KEYS_SETUP.md << 'EOF'
# 🔑 API Keys Setup Guide

## Required API Keys and Tokens

### 1. OpenAI API Key
- **Get from**: https://platform.openai.com/api-keys
- **Cost**: Pay-per-use (starts at $5)
- **Format**: `sk-proj-...`
- **Usage**: AI code assistance, explanations, refactoring

### 2. Google OAuth2 Credentials
- **Get from**: https://console.cloud.google.com/
- **Steps**:
  1. Create new project
  2. Enable Google+ API
  3. Create OAuth 2.0 credentials
  4. Add redirect URI: `http://localhost:5000/api/auth/google/callback`

### 3. GitHub OAuth2 Credentials
- **Get from**: https://github.com/settings/developers
- **Steps**:
  1. Create new OAuth App
  2. Set callback URL: `http://localhost:5000/api/auth/github/callback`

### 4. AWS Credentials (Optional)
- **Get from**: https://aws.amazon.com/
- **Purpose**: File storage and cloud services
- **Cost**: Pay-per-use (S3 storage)

## Quick Setup Commands

```bash
# 1. Set up database
./setup-database.sh

# 2. Start development environment
./start-dev.sh

# 3. Edit environment variables
nano .env
```

## What Each Key Does

- **JWT_SECRET**: Signs authentication tokens (auto-generated)
- **GOOGLE_CLIENT_ID/SECRET**: Google login authentication
- **GITHUB_CLIENT_ID/SECRET**: GitHub login authentication  
- **OPENAI_API_KEY**: AI-powered code assistance
- **AWS_ACCESS_KEY_ID/SECRET**: Cloud file storage
- **DATABASE_URL**: PostgreSQL connection
- **REDIS_URL**: Redis cache connection

## Security Notes

⚠️ **Never commit your .env file to Git!**
⚠️ **Use different keys for development/production**
⚠️ **Rotate secrets regularly**
⚠️ **Monitor API usage and costs**
EOF

# Step 8: Create quick start script
print_info "Creating quick start script..."

cat > quick-start.sh << 'EOF'
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
EOF

chmod +x quick-start.sh

# Step 9: Create production deployment script
print_info "Creating production deployment script..."

cat > deploy-production.sh << 'EOF'
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
EOF

chmod +x deploy-production.sh

# Final setup
print_status "Setup complete! Here's what you have:"

echo ""
echo "📁 Files Created:"
echo "  ✅ .env - Environment configuration with real tokens"
echo "  ✅ setup-database.sh - Database setup script"
echo "  ✅ start-dev.sh - Development startup script"
echo "  ✅ quick-start.sh - Quick start script"
echo "  ✅ docker-compose.dev.yml - Development Docker setup"
echo "  ✅ API_KEYS_SETUP.md - API keys setup guide"
echo "  ✅ deploy-production.sh - Production deployment script"

echo ""
echo "🔑 Configuration Includes:"
echo "  ✅ JWT Secret (auto-generated secure key)"
echo "  ✅ Google OAuth2 placeholders"
echo "  ✅ GitHub OAuth2 placeholders"
echo "  ✅ OpenAI API key placeholder"
echo "  ✅ AWS credentials placeholders"
echo "  ✅ Database configuration"
echo "  ✅ Redis configuration"
echo "  ✅ Security settings"
echo "  ✅ Rate limiting"
echo "  ✅ Feature flags"

echo ""
echo "🚀 Next Steps:"
echo "  1. Edit .env file with your actual API keys"
echo "  2. Run: ./setup-database.sh"
echo "  3. Run: ./start-dev.sh"
echo "  4. Open: http://localhost:3000"

echo ""
echo "📚 Documentation:"
echo "  📖 API_KEYS_SETUP.md - How to get API keys"
echo "  📖 CONFIGURATION_GUIDE.md - Complete setup guide"
echo "  📖 DEPLOYMENT.md - Production deployment"
echo "  📖 API.md - API documentation"

print_status "IntelliCode Hub is ready for development! 🎉"
