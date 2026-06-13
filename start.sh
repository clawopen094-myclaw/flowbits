#!/bin/bash

# ContentFlow — start the development server
cd "$(dirname "$0")"

# Check if node_modules exist; if not, install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Copy .env.example if no .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env found. Copy .env.example and set your keys."
fi

echo "🚀 Starting ContentFlow dev server..."
npm run dev
