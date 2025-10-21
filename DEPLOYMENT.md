# IntelliCode Hub - Deployment Guide

This guide covers deploying IntelliCode Hub to production environments.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+
- Redis 7+
- AWS Account (for S3 storage)
- OpenAI API Key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/intellicode_hub"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# AWS
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="intellicode-hub-storage"

# Frontend
VITE_API_URL="http://localhost:5000"
VITE_WS_URL="ws://localhost:5000"

# Backend
PORT=5000
NODE_ENV="production"
CORS_ORIGIN="https://your-domain.com"
```

## Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd intellicode-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up the database:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432
   - Redis: localhost:6379

## Docker Deployment

### Using Docker Compose

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations:**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Deployment

1. **Build production images:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy with production profile:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Cloud Deployment

### AWS Deployment

1. **Set up RDS PostgreSQL:**
   - Create a PostgreSQL RDS instance
   - Configure security groups
   - Update DATABASE_URL

2. **Set up ElastiCache Redis:**
   - Create a Redis cluster
   - Configure security groups
   - Update REDIS_URL

3. **Set up S3 bucket:**
   - Create an S3 bucket for file storage
   - Configure CORS policy
   - Update AWS credentials

4. **Deploy to ECS:**
   - Create ECS cluster
   - Define task definitions
   - Set up load balancer

### Vercel Deployment (Frontend)

1. **Connect to Vercel:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy frontend:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure environment variables in Vercel dashboard**

### Railway Deployment

1. **Connect to Railway:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Deploy:**
   ```bash
   railway up
   ```

## Database Management

### Migrations

```bash
# Create a new migration
cd backend
npx prisma migrate dev --name migration-name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Seeding

```bash
cd backend
npm run db:seed
```

## Monitoring and Logging

### Health Checks

- Backend: `GET /health`
- Database: Check connection status
- Redis: Check connection status

### Logging

- Application logs: `logs/combined.log`
- Error logs: `logs/error.log`
- Access logs: Morgan middleware

### Performance Monitoring

- Use APM tools like New Relic or DataDog
- Monitor database performance
- Track API response times
- Monitor WebSocket connections

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use secure secret management
   - Rotate secrets regularly

2. **Database Security:**
   - Use strong passwords
   - Enable SSL connections
   - Restrict network access

3. **API Security:**
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all inputs
   - Implement CORS properly

4. **Authentication:**
   - Use secure JWT secrets
   - Implement token expiration
   - Use secure session management

## Scaling Considerations

1. **Horizontal Scaling:**
   - Use load balancers
   - Implement session sharing
   - Use Redis for session storage

2. **Database Scaling:**
   - Read replicas for read operations
   - Connection pooling
   - Query optimization

3. **File Storage:**
   - Use CDN for static assets
   - Implement file compression
   - Use appropriate storage classes

## Troubleshooting

### Common Issues

1. **Database Connection Issues:**
   - Check DATABASE_URL format
   - Verify network connectivity
   - Check firewall settings

2. **Redis Connection Issues:**
   - Check REDIS_URL format
   - Verify Redis is running
   - Check memory usage

3. **WebSocket Issues:**
   - Check CORS configuration
   - Verify WebSocket URL
   - Check firewall settings

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### File Storage Backup

- Use S3 versioning
- Implement cross-region replication
- Regular backup verification

## Performance Optimization

1. **Frontend:**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement code splitting
   - Optimize bundle size

2. **Backend:**
   - Use connection pooling
   - Implement caching
   - Optimize database queries
   - Use compression middleware

3. **Database:**
   - Add appropriate indexes
   - Optimize query performance
   - Use connection pooling
   - Monitor query performance

## Maintenance

### Regular Tasks

1. **Security Updates:**
   - Update dependencies regularly
   - Monitor security advisories
   - Apply security patches

2. **Performance Monitoring:**
   - Monitor response times
   - Check error rates
   - Monitor resource usage

3. **Database Maintenance:**
   - Regular backups
   - Vacuum and analyze tables
   - Monitor disk usage

### Updates

```bash
# Update dependencies
npm update

# Update Docker images
docker-compose pull
docker-compose up -d
```

## Support

For issues and questions:

1. Check the documentation
2. Review logs for errors
3. Check GitHub issues
4. Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.
