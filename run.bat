@echo off
REM SJC Slot Registration Bot - Quick Run Script for Windows
REM Use this to start the bot after initial setup

echo.
echo 🤖 Starting SJC Slot Registration Bot...
echo.

REM Check if config.js exists
if not exist "config.js" (
    echo ❌ Configuration file not found!
    echo.
    echo Please run setup first:
    echo   setup.bat
    echo   or
    echo   npm run setup
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Run the bot
node index.js

pause
exit /b 0
