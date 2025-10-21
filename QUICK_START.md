# 🚀 IntelliCode Hub - Quick Start Guide

## **How to Access Your IntelliCode Hub**

### **Step 1: Install Node.js**
You need Node.js to run the application. Here are the easiest ways:

#### **Option A: Download from Official Website**
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Install the .pkg file
4. Restart your terminal

#### **Option B: Using Homebrew (if you have it)**
```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js
brew install node
```

#### **Option C: Using nvm (Node Version Manager)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install Node.js
nvm install 18
nvm use 18
```

### **Step 2: Install Dependencies**
```bash
cd /Users/mac/.ssh/intellicode-hub

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### **Step 3: Set Up Database (Optional for Demo)**
```bash
# If you have PostgreSQL installed:
cd backend
npx prisma migrate dev
npx prisma generate
```

### **Step 4: Start the Application**
```bash
# Go back to root directory
cd /Users/mac/.ssh/intellicode-hub

# Start both frontend and backend
npm run dev
```

## **🌐 Access URLs**

Once running, you can access:

- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## **🎯 What You'll See**

### **1. Home Page (http://localhost:3000)**
- Beautiful landing page with AI-powered features
- Dark/light theme toggle
- "Start Coding" and "View Projects" buttons
- Feature showcase with stats

### **2. Code Editor (http://localhost:3000/editor)**
- Full VS Code-like editor with Monaco Editor
- AI-powered code suggestions
- Real-time collaboration features
- File explorer sidebar
- AI assistant panel

### **3. Projects Dashboard (http://localhost:3000/projects)**
- Card-based project management
- Create new projects
- View existing projects
- Search and filter options

### **4. User Profile (http://localhost:3000/profile)**
- User settings and preferences
- Theme customization
- Notification settings
- Account management

## **🔧 Alternative: Docker Setup (No Node.js Required)**

If you prefer not to install Node.js, you can use Docker:

```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop

# Start the application with Docker
cd /Users/mac/.ssh/intellicode-hub
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## **📱 Mobile Access**

The application is fully responsive and works on:
- **Desktop**: Full experience with sidebar
- **Tablet**: Collapsible sidebar
- **Mobile**: Touch-optimized interface

## **🎨 Features You'll Experience**

### **AI-Powered Code Intelligence**
- Smart autocomplete with GPT-4
- Code explanation and refactoring
- Intelligent suggestions
- Context-aware assistance

### **Real-Time Collaboration**
- Live cursor tracking
- Multi-user editing
- Chat integration
- Video call features

### **Modern UI/UX**
- Dark/light theme switching
- Smooth animations
- Glass morphism effects
- Responsive design

### **Project Management**
- GitHub-style file explorer
- Version control integration
- Project templates
- Public/private projects

## **🚨 Troubleshooting**

### **If you get "command not found: npm"**
- Node.js is not installed
- Follow Step 1 above to install Node.js

### **If you get "port already in use"**
```bash
# Kill processes using ports 3000 and 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### **If you get database connection errors**
- The app will work without a database for the demo
- Database is only needed for full functionality

### **If you get permission errors**
```bash
# Fix file permissions
chmod +x setup.sh
chmod +x start-dev.sh
chmod +x quick-start.sh
```

## **🎉 Success!**

Once everything is running, you'll have:

✅ **Full-featured code editor** with AI assistance  
✅ **Real-time collaboration** capabilities  
✅ **Project management** dashboard  
✅ **Modern, responsive UI** with dark/light themes  
✅ **Complete development environment**  

**Your IntelliCode Hub will be live at: http://localhost:3000** 🚀

## **📞 Need Help?**

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Try the Docker setup as an alternative
4. Check the CONFIGURATION_GUIDE.md for detailed setup

**Happy coding with AI-powered intelligence!** ✨🤖
