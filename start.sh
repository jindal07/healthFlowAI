#!/bin/bash

echo "🚀 Starting AI Health Report Reviewer..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it with your GEMINI_API_KEY"
    echo "Example:"
    echo "GEMINI_API_KEY=your_key_here"
    echo "PORT=5000"
    exit 1
fi

# Start backend in background
echo "🧠 Starting backend server..."
cd server && npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend server..."
cd ../client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers started!"
echo "🧠 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for either process to exit
wait
