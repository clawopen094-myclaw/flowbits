#!/bin/bash

# Navigate to the project directory (optional)
cd "$(dirname "$0")"

# Check if crawl4ai is installed; if not, install it
if ! command -v crawl4ai &> /dev/null; then
    echo "📦 Installing crawl4ai..."
    pip install -U crawl4ai
    pip install crawl4ai --pre
    crawl4ai-setup
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first."
    exit 1
fi

# Run pnpm dev
echo "🚀 Starting the development server..."
pnpm dev

# Optional: Add error handling
if [ $? -ne 0 ]; then
    echo "❌ Failed to start the development server."
    exit 1
fi