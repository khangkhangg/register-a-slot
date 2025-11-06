#!/bin/bash

# SJC Slot Registration Bot - Setup Script for Unix/Linux/Mac
# This script checks for Node.js and runs the interactive setup

set -e

echo ""
echo "🤖 SJC Slot Registration Bot - Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo ""
    echo "Please install Node.js 18 or higher from:"
    echo "👉 https://nodejs.org/"
    echo ""
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old"
    echo "Please install Node.js 18 or higher from:"
    echo "👉 https://nodejs.org/"
    echo ""
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    echo "Please install npm"
    echo ""
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run the interactive setup
echo "🚀 Starting interactive setup..."
echo ""
node setup.js

exit 0
