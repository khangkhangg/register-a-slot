@echo off
REM SJC Slot Registration Bot - Setup Script for Windows
REM This script checks for Node.js and runs the interactive setup

echo.
echo 🤖 SJC Slot Registration Bot - Setup
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo.
    echo Please install Node.js 18 or higher from:
    echo 👉 https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    echo Please install npm
    echo.
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% detected
echo.

REM Install dependencies if needed
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Run the interactive setup
echo 🚀 Starting interactive setup...
echo.
node setup.js

pause
exit /b 0
