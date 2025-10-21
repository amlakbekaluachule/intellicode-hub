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
