#!/bin/bash

# Firefox Setup Script for SJC Slot Registration Bot
# This script prepares the extension for Firefox by using the Firefox-compatible manifest

echo "🦊 Setting up SJC Slot Bot for Firefox..."

# Check if manifest-firefox.json exists
if [ ! -f "manifest-firefox.json" ]; then
    echo "❌ Error: manifest-firefox.json not found!"
    exit 1
fi

# Backup original manifest if it exists
if [ -f "manifest.json" ]; then
    if [ ! -f "manifest-chrome.json" ]; then
        echo "📦 Backing up Chrome manifest to manifest-chrome.json..."
        cp manifest.json manifest-chrome.json
    fi
fi

# Copy Firefox manifest
echo "🔄 Installing Firefox-compatible manifest..."
cp manifest-firefox.json manifest.json

echo "✅ Firefox setup complete!"
echo ""
echo "Next steps:"
echo "1. Generate icons (if not done already): Open icons/icon-generator.html"
echo "2. Open Firefox and go to: about:debugging#/runtime/this-firefox"
echo "3. Click 'Load Temporary Add-on'"
echo "4. Select any file in the browser-extension folder"
echo "5. Configure and enjoy!"
echo ""
echo "Note: To switch back to Chrome, run: cp manifest-chrome.json manifest.json"
