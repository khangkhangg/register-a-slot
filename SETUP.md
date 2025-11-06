# 🚀 One-Command Setup Guide

This guide shows you how to setup and run the SJC Slot Registration Bot with just ONE command!

## ⚡ Quick Setup (Easiest Method)

### For Unix/Linux/Mac Users:

```bash
# 1. Clone the repository
git clone https://github.com/khangkhangg/register-a-slot.git
cd register-a-slot

# 2. Run setup script - that's it!
./setup.sh
```

### For Windows Users:

```cmd
# 1. Clone the repository
git clone https://github.com/khangkhangg/register-a-slot.git
cd register-a-slot

# 2. Double-click setup.bat
# Or run in Command Prompt:
setup.bat
```

### Alternative (Works on All Platforms):

```bash
# After cloning
npm run setup
```

That's it! The interactive setup will guide you through everything.

---

## 📋 What the Setup Script Does

The setup script automates everything for you:

1. ✅ **Checks Prerequisites** - Verifies Node.js is installed
2. ✅ **Installs Dependencies** - Runs `npm install` automatically
3. ✅ **Guides Telegram Bot Creation** - Step-by-step instructions
4. ✅ **Gets Your Chat ID** - Automatically fetches it from Telegram
5. ✅ **Collects Your Information** - Asks for name and citizen ID
6. ✅ **Configures Email** (Optional) - Sets up email notifications
7. ✅ **Creates config.js** - Generates configuration file
8. ✅ **Tests Everything** - Sends test message to Telegram
9. ✅ **Starts the Bot** (Optional) - Can run immediately

---

## 🎬 Setup Walkthrough

When you run the setup script, here's what happens:

### Step 1: Prerequisites Check
```
===========================================================
  Checking Prerequisites
===========================================================

✅ Node.js v18.17.0 detected
```

### Step 2: Dependency Installation
```
===========================================================
  Installing Dependencies
===========================================================

ℹ️  This may take 1-2 minutes...
✅ Dependencies installed successfully!
```

### Step 3: Telegram Bot Setup
```
===========================================================
  Telegram Bot Setup
===========================================================

To receive notifications, you need a Telegram bot.

Follow these steps:
1. Open Telegram on your phone or computer
2. Search for "@BotFather"
3. Start a chat and send: /newbot
4. Follow the prompts to create your bot
5. Copy the bot token (looks like: 1234567890:ABCdefGHI...)

Have you created your Telegram bot? (yes/no): yes
Enter your bot token: 7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8
✅ Bot token received!
```

### Step 4: Chat ID Retrieval
```
===========================================================
  Getting Your Chat ID
===========================================================

To get your chat ID:
1. Open Telegram
2. Search for your bot
3. Send any message to your bot (e.g., "hello")

Press Enter after you have sent a message to your bot...
ℹ️  Fetching your chat ID...
✅ Chat ID found: 123456789
✅ Test message sent to your Telegram!
```

### Step 5: User Information
```
===========================================================
  Your Registration Information
===========================================================

ℹ️  This information will be used to fill the registration form.

Enter your full name: Nguyễn Thị Thu Hương
Enter your Citizen ID (CCCD): 031193003423
✅ Credentials saved!
```

### Step 6: Email Setup (Optional)
```
===========================================================
  Email Notifications (Optional)
===========================================================

ℹ️  You can also receive email notifications in addition to Telegram.

Do you want to setup email notifications? (yes/no): no
ℹ️  Skipping email setup. You can configure it later in config.js
```

### Step 7: Configuration Created
```
===========================================================
  Creating Configuration File
===========================================================

✅ Configuration file created: config.js
```

### Step 8: Testing
```
===========================================================
  Testing Telegram Configuration
===========================================================

ℹ️  Sending test message...
✅ Test message sent! Check your Telegram.
```

### Step 9: Summary & Launch
```
===========================================================
  🎉 Setup Complete!
===========================================================

✅ Your bot is ready to use!

📋 Configuration Summary:
   Name: Nguyễn Thị Thu Hương
   Citizen ID: 031193003423
   Telegram: ✅ Configured
   Email: ❌ Not configured

📱 Next Steps:
   1. Run: npm start
   2. Watch the bot fill the form automatically
   3. Receive notifications on Telegram

📖 Documentation:
   • README.md - Complete guide
   • FEATURES.md - Advanced features
   • config.js - Your configuration (you can edit this)

💡 Tips:
   • Press Ctrl+C to stop the bot
   • The bot will retry automatically if it fails
   • Check Telegram for notifications

Do you want to start the bot now? (yes/no): yes

ℹ️  Starting bot...
```

---

## 🔄 Running the Bot After Setup

After the initial setup, you can start the bot anytime using:

### Method 1: NPM Script (Recommended)
```bash
npm start
```

### Method 2: Quick Run Scripts

**Unix/Linux/Mac:**
```bash
./run.sh
```

**Windows:**
```cmd
run.bat
```

### Method 3: Direct Node
```bash
node index.js
```

---

## 🛠️ Available Commands

After setup, these commands are available:

```bash
# Start the bot
npm start

# Run setup again (reconfigure)
npm run setup

# Test Telegram notifications
npm run test:telegram

# Test email notifications
npm run test:email

# Get Telegram chat ID
npm run get:chatid
```

---

## 🔧 Troubleshooting Setup

### Problem: "Node.js is not installed"

**Solution:**
1. Download Node.js 18+ from https://nodejs.org/
2. Install it
3. Restart your terminal
4. Run setup again

### Problem: "npm: command not found"

**Solution:**
Node.js installation includes npm. If it's missing:
1. Reinstall Node.js from https://nodejs.org/
2. Make sure to install the LTS version
3. Restart terminal

### Problem: "Permission denied" on Unix/Mac

**Solution:**
```bash
# Make scripts executable
chmod +x setup.sh
chmod +x run.sh

# Then run
./setup.sh
```

### Problem: Setup script won't run on Windows

**Solution:**
Try the NPM method instead:
```bash
npm run setup
```

Or right-click `setup.bat` and "Run as Administrator"

### Problem: "Cannot get chat ID"

**Solution:**
1. Make sure you sent a message to your bot first
2. The message must be sent BEFORE running setup
3. Try using @userinfobot to get your chat ID manually:
   - Search for @userinfobot on Telegram
   - Send any message
   - It will reply with your chat ID
   - Enter that when setup asks

### Problem: "Failed to create config.js"

**Solution:**
Check write permissions in the directory:
```bash
# Unix/Mac
ls -la

# If needed, fix permissions
chmod 755 .
```

For Windows, run as Administrator.

### Problem: Setup completed but bot won't start

**Solution:**
1. Check if config.js was created: `ls config.js`
2. Verify Telegram token and chat ID in config.js
3. Run test: `npm run test:telegram`
4. If test works, try: `npm start`

---

## 📝 Manual Setup (If Automated Setup Fails)

If the automated setup doesn't work, follow the manual guide in [README.md](README.md#-complete-setup-guide).

---

## ⚙️ Configuration After Setup

You can edit `config.js` anytime to change:

- Retry intervals
- Mouse movement patterns
- Browser settings
- Email configuration
- And more...

See [FEATURES.md](FEATURES.md) for advanced configuration options.

---

## 🎯 Quick Reference

### First Time Setup:
```bash
git clone https://github.com/khangkhangg/register-a-slot.git
cd register-a-slot
./setup.sh  # or setup.bat on Windows
```

### Subsequent Runs:
```bash
npm start  # or ./run.sh or run.bat
```

### Reconfigure:
```bash
npm run setup
```

### Test Notifications:
```bash
npm run test:telegram
npm run test:email
```

---

## 💡 Pro Tips

1. **Run setup in a terminal** - Don't double-click setup.js directly, use the shell scripts
2. **Have Telegram open** - You'll need it during setup
3. **Create bot first** - Set up @BotFather before running setup
4. **Save your chat ID** - Write it down in case you need it later
5. **Read the summary** - The setup shows important info at the end
6. **Test before running** - Use `npm run test:telegram` to verify

---

## ❓ Need Help?

- **Setup issues:** See [Troubleshooting Setup](#-troubleshooting-setup) above
- **Bot issues:** See [README.md - Troubleshooting](README.md#-troubleshooting)
- **Advanced features:** See [FEATURES.md](FEATURES.md)

---

**The setup script makes getting started super easy! Just run `./setup.sh` and follow the prompts.** 🚀
