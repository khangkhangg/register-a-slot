# Quick Start Guide

Get the bot running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Telegram Bot

1. Open Telegram, search for **@BotFather**
2. Send: `/newbot`
3. Follow instructions
4. **Save the bot token** (example: `7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8`)

## 3. Get Your Chat ID

**Option A: Quick Method**
```bash
# Start a chat with your bot, send any message, then run:
node get-chat-id.js YOUR_BOT_TOKEN
```

**Option B: Manual Method**
1. Search for **@userinfobot** on Telegram
2. Send any message
3. Copy the ID number it replies with

## 4. Configure the Bot

Edit `config.js`:

```javascript
export default {
  credentials: {
    name: "Your Full Name",           // ✏️ Change this
    citizenId: "Your Citizen ID"      // ✏️ Change this
  },

  telegram: {
    enabled: true,
    botToken: "YOUR_BOT_TOKEN",       // ✏️ Paste your bot token
    chatId: "YOUR_CHAT_ID"            // ✏️ Paste your chat ID
  }

  // Other settings are pre-configured
};
```

## 5. Test Telegram

```bash
node test-telegram.js
```

You should receive a test message on Telegram! ✅

## 5.5. (Optional) Setup Email Notifications

Want email notifications too? Quick setup:

```bash
# 1. Configure email in config.js
email: {
  enabled: true,
  service: "gmail",
  user: "your-email@gmail.com",
  password: "your-app-password",  # Get from Google Account > App Passwords
  to: "recipient@email.com"
}

# 2. Test it
npm run test:email
```

See [FEATURES.md](FEATURES.md#email-notifications) for detailed setup.

## 6. Run the Bot

```bash
npm start
```

The bot will:
- ✅ Open browser and navigate to SJC website
- ✅ Fill in your information automatically
- ✅ Select area and transaction point
- ✅ Wait randomly (5-10s) to avoid detection
- ✅ Move mouse naturally to click "Not bot" checkbox
- ✅ Submit the form
- ✅ Send you Telegram notification
- ✅ Retry automatically if it fails (every 1-30 minutes)
- ✅ Stop when successful

## Customization

### Change Retry Interval

In `config.js`:

```javascript
timing: {
  retryIntervalMin: 5 * 60 * 1000,   // 5 minutes
  retryIntervalMax: 10 * 60 * 1000   // 10 minutes
}
```

### Run in Background (Headless)

In `config.js`:

```javascript
browser: {
  headless: true  // No visible browser window
}
```

### Change Area/Transaction Point

In `config.js`:

```javascript
formData: {
  area: "Your Area",
  transactionPoint: "Your Preferred Point"
}
```

## Troubleshooting

### Telegram not working?
```bash
# Check your configuration
node test-telegram.js

# If it fails, verify:
# 1. Bot token is correct
# 2. Chat ID is correct
# 3. You've sent a message to your bot
```

### Bot detected?
```javascript
// In config.js, increase delays:
timing: {
  beforeBotCheckMin: 8000,   // Wait longer
  beforeBotCheckMax: 15000
}
```

### Elements not found?
The website may have changed. See main README.md for debugging steps.

## Commands

```bash
npm start              # Start the bot
node test-telegram.js  # Test Telegram notifications
node get-chat-id.js    # Get your Telegram chat ID
```

## Stop the Bot

Press `Ctrl+C` in the terminal

## Need More Help?

See the full [README.md](README.md) for:
- Detailed explanations
- Advanced configuration
- Security recommendations
- FAQ
- Troubleshooting guide

---

**Happy automating! 🤖**
