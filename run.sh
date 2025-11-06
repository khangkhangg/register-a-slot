#!/bin/bash

# SJC Slot Registration Bot - Quick Run Script
# Use this to start the bot after initial setup

set -e

echo ""
echo "🤖 Starting SJC Slot Registration Bot..."
echo ""

# Check if config.js exists
if [ ! -f "config.js" ]; then
    echo "❌ Configuration file not found!"
    echo ""
    echo "Please run setup first:"
    echo "  ./setup.sh"
    echo "  or"
    echo "  npm run setup"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run the bot
node index.js

exit 0
