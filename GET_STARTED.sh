#!/bin/bash

echo "🚀 IntelliCode Hub - Getting Started"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "📥 Please install Node.js first:"
    echo "   1. Go to https://nodejs.org/"
    echo "   2. Download the LTS version"
    echo "   3. Install the .pkg file"
    echo "   4. Restart your terminal"
    echo ""
    echo "🔄 After installing Node.js, run this script again."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo "✅ npm is available: $(npm --version)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the IntelliCode Hub directory"
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."

# Install dependencies
echo "Installing root dependencies..."
npm install

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Installing backend dependencies..."
cd ../backend
npm install

cd ..

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "🚀 Starting IntelliCode Hub..."
echo ""
echo "🌐 Your application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📱 Open your browser and go to: http://localhost:3000"
echo ""
echo "🛑 Press Ctrl+C to stop the servers"
echo ""

# Start the development servers
npm run dev
