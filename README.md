# IntelliCode Hub

An AI-powered code editor and publishing platform that combines the best of VS Code, GitHub, and Replit with intelligent AI assistance.

## Features

- 🚀 **Smart AI Autocomplete** - Powered by GPT-4 with inline suggestions
- 🎨 **Modern UI** - Dark/light modes with bento-grid layouts and glow effects
- 🤝 **Real-time Collaboration** - Multi-user live editing with WebSockets
- 📁 **Project Management** - GitHub-style file explorer and project dashboard
- 🔍 **Code Intelligence** - Explain and refactor code with AI assistance
- 📝 **Live Markdown Preview** - Real-time documentation editing
- 🔐 **Secure Authentication** - OAuth2 with Google and GitHub
- 🚢 **Auto-deployment** - Docker containers with CI/CD pipeline

## Tech Stack

### Frontend
- React.js + Vite
- TypeScript
- TailwindCSS + Chakra UI
- Monaco Editor
- WebSocket client

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- WebSocket server
- Redis caching

### AI & Services
- OpenAI GPT-4 API
- AWS S3 storage
- GitHub Actions CI/CD

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database URLs
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
intellicode-hub/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── docker-compose.yml # Local development setup
├── .github/           # GitHub Actions workflows
└── docs/              # Documentation
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Database Setup
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## Deployment

### Docker
```bash
docker-compose up -d
```

### Production
- Frontend: Deploy to Vercel
- Backend: Deploy to AWS/DigitalOcean
- Database: PostgreSQL on AWS RDS
- Storage: AWS S3

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
