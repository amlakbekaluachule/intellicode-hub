# IntelliCode Hub - Complete Configuration Guide

This guide shows you exactly how to configure IntelliCode Hub with real API keys, tokens, and credentials.

## 🔑 **Environment Variables Setup**

### **1. Database Configuration**
```bash
# PostgreSQL Database
DATABASE_URL="postgresql://username:password@localhost:5432/intellicode_hub"
REDIS_URL="redis://localhost:6379"
```

### **2. JWT Authentication**
```bash
# Generate a secure JWT secret (32+ characters)
JWT_SECRET="intellicode-hub-super-secret-jwt-key-2024-production-ready-secure-token"
TOKEN_EXPIRES_IN="7d"
BCRYPT_ROUNDS=12
```

### **3. OAuth2 Configuration**

#### **Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `https://yourdomain.com/api/auth/google/callback`

```bash
GOOGLE_CLIENT_ID="123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz123456"
```

#### **GitHub OAuth Setup:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:5000/api/auth/github/callback`
   - `https://yourdomain.com/api/auth/github/callback`

```bash
GITHUB_CLIENT_ID="Iv1.1234567890abcdef"
GITHUB_CLIENT_SECRET="1234567890abcdef1234567890abcdef12345678"
```

### **4. OpenAI API Configuration**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add billing information
4. Set usage limits

```bash
OPENAI_API_KEY="sk-proj-abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890"
```

### **5. AWS Configuration**
1. Create AWS account
2. Create IAM user with S3 permissions
3. Create S3 bucket for file storage
4. Configure CORS policy

```bash
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="intellicode-hub-production-storage"
```

### **6. Frontend Configuration**
```bash
VITE_API_URL="http://localhost:5000"
VITE_WS_URL="ws://localhost:5000"
```

### **7. Backend Configuration**
```bash
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
LOG_LEVEL="info"
```

## 🚀 **Complete Setup Example**

Here's what your complete `.env` file should look like:

```bash
# ===========================================
# INTELLICODE HUB - PRODUCTION CONFIGURATION
# ===========================================

# Database Configuration
DATABASE_URL="postgresql://postgres:your_secure_password@localhost:5432/intellicode_hub"
REDIS_URL="redis://localhost:6379"

# JWT Authentication (Generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secure-jwt-secret-key-32-characters-minimum"
TOKEN_EXPIRES_IN="7d"
BCRYPT_ROUNDS=12

# Google OAuth2 (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz123456"

# GitHub OAuth2 (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID="Iv1.1234567890abcdef"
GITHUB_CLIENT_SECRET="1234567890abcdef1234567890abcdef12345678"

# OpenAI API (Get from OpenAI Platform)
OPENAI_API_KEY="sk-proj-abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890"

# AWS Configuration (Get from AWS IAM)
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="intellicode-hub-production-storage"

# Frontend URLs
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
```

## 🔧 **Step-by-Step Setup**

### **Step 1: Clone and Setup**
```bash
git clone https://github.com/amlakbekaluachule/intellicode-hub.git
cd intellicode-hub
npm install
```

### **Step 2: Database Setup**
```bash
# Install PostgreSQL and Redis
# macOS with Homebrew:
brew install postgresql redis

# Start services
brew services start postgresql
brew services start redis

# Create database
createdb intellicode_hub
```

### **Step 3: Environment Configuration**
```bash
# Copy environment template
cp env.example .env

# Edit with your actual values
nano .env
```

### **Step 4: Database Migration**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### **Step 5: Start Development**
```bash
# Start all services
npm run dev

# Or start individually
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000
```

## 🎯 **What Each Token/Key Does**

### **JWT_SECRET**
- **Purpose**: Signs and verifies authentication tokens
- **Format**: 32+ character random string
- **Generate**: `openssl rand -base64 32`
- **Security**: Keep this secret! Rotate regularly.

### **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET**
- **Purpose**: Google OAuth2 authentication
- **Get from**: Google Cloud Console
- **Format**: Client ID (long string), Secret (GOCSPX-...)
- **Security**: Public ID, private secret

### **GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET**
- **Purpose**: GitHub OAuth2 authentication
- **Get from**: GitHub Developer Settings
- **Format**: Client ID (Iv1...), Secret (random hex)
- **Security**: Public ID, private secret

### **OPENAI_API_KEY**
- **Purpose**: AI-powered code assistance
- **Get from**: OpenAI Platform
- **Format**: sk-proj-... (starts with sk-proj-)
- **Security**: Keep secret! Has billing implications.

### **AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY**
- **Purpose**: File storage and cloud services
- **Get from**: AWS IAM Console
- **Format**: Access Key (AKIA...), Secret (random string)
- **Security**: Keep secret! Has AWS billing implications.

## 🔒 **Security Best Practices**

### **1. Environment Variables**
- Never commit `.env` files to Git
- Use different keys for development/production
- Rotate secrets regularly
- Use secure secret management in production

### **2. JWT Security**
- Use strong, random secrets (32+ characters)
- Set appropriate expiration times
- Implement token refresh
- Use HTTPS in production

### **3. API Keys**
- Monitor usage and billing
- Set rate limits
- Use least-privilege access
- Rotate keys regularly

### **4. Database Security**
- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular backups

## 🚀 **Production Deployment**

### **Environment Variables for Production**
```bash
# Production Database
DATABASE_URL="postgresql://user:pass@prod-db:5432/intellicode_hub"
REDIS_URL="redis://prod-redis:6379"

# Production URLs
VITE_API_URL="https://api.intellicodehub.com"
VITE_WS_URL="wss://api.intellicodehub.com"

# Production Security
NODE_ENV="production"
CORS_ORIGIN="https://intellicodehub.com"
```

### **Docker Production Setup**
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Set production environment
export NODE_ENV=production
export DATABASE_URL=your_prod_database_url
export REDIS_URL=your_prod_redis_url
```

## 📊 **Monitoring and Analytics**

### **Health Check Endpoints**
- `GET /health` - Application health
- `GET /api/health` - API health
- `GET /metrics` - Application metrics

### **Logging Configuration**
```bash
LOG_LEVEL="info"  # debug, info, warn, error
DEBUG_MODE=true   # Enable debug logging
```

## 🎉 **You're Ready!**

With this configuration, your IntelliCode Hub will have:

✅ **Authentication**: Google + GitHub OAuth2  
✅ **AI Features**: OpenAI GPT-4 integration  
✅ **File Storage**: AWS S3 cloud storage  
✅ **Real-time**: WebSocket collaboration  
✅ **Security**: JWT tokens and rate limiting  
✅ **Database**: PostgreSQL with Prisma ORM  
✅ **Caching**: Redis for performance  
✅ **Monitoring**: Health checks and logging  

**Start coding with AI-powered intelligence!** 🚀✨
