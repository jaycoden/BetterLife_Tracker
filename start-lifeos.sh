#!/bin/bash

# Jayden's Life OS Startup Script
# This script starts your Life OS web application

echo "🚀 Starting Jayden's Life OS..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo "Please configure your Firebase and Anthropic API keys first."
    echo "Copy .env.local.example to .env.local and fill in your credentials."
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to exit..."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo ""
echo "✨ Starting Life OS on http://localhost:3000"
echo ""
echo "📌 Bookmark this URL in your browser: http://localhost:3000"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""

npm run dev
