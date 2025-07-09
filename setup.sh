#!/bin/bash

echo "🩺 Setting up AI Health Report Reviewer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Setup backend
echo "📦 Installing backend dependencies..."
cd server && npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Setup frontend
echo "📦 Installing frontend dependencies..."
cd ../client && npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your Gemini API key to the .env file"
echo "2. Run './start.sh' to start both servers"
echo ""
echo "ℹ️  Get your Gemini API key from: https://makersuite.google.com/app/apikey"
