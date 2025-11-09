@echo off
REM Firefox Setup Script for SJC Slot Registration Bot
REM This script prepares the extension for Firefox by using the Firefox-compatible manifest

echo.
echo 🦊 Setting up SJC Slot Bot for Firefox...
echo.

REM Check if manifest-firefox.json exists
if not exist "manifest-firefox.json" (
    echo ❌ Error: manifest-firefox.json not found!
    pause
    exit /b 1
)

REM Backup original manifest if it exists
if exist "manifest.json" (
    if not exist "manifest-chrome.json" (
        echo 📦 Backing up Chrome manifest to manifest-chrome.json...
        copy manifest.json manifest-chrome.json >nul
    )
)

REM Copy Firefox manifest
echo 🔄 Installing Firefox-compatible manifest...
copy manifest-firefox.json manifest.json >nul

echo.
echo ✅ Firefox setup complete!
echo.
echo Next steps:
echo 1. Generate icons (if not done already): Open icons\icon-generator.html
echo 2. Open Firefox and go to: about:debugging#/runtime/this-firefox
echo 3. Click 'Load Temporary Add-on'
echo 4. Select any file in the browser-extension folder
echo 5. Configure and enjoy!
echo.
echo Note: To switch back to Chrome, run: copy manifest-chrome.json manifest.json
echo.
pause
