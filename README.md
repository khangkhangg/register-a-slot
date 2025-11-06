# SJC Slot Registration Bot

Automated bot for registering time slots on the SJC (Saigon Jewelry Company) website with advanced bot detection evasion.

## Features

- ✅ **Bot Detection Evasion**: Uses Puppeteer Stealth plugin and human-like behavior
- 🤖 **Human-like Interactions**: Bezier curve mouse movements, random delays, typing variations
- 🔄 **Smart Retry Logic**: Configurable retry intervals (1-30 minutes)
- 📱 **Telegram Notifications**: Real-time updates on success/failure
- ⚙️ **Fully Configurable**: Easy configuration through `config.js`
- 🎯 **Automatic Form Filling**: Handles complex dropdowns and bot checkboxes
- 🛡️ **Session Management**: Detects and handles session expiration
- 📊 **Detailed Logging**: Color-coded logs with timestamps

## Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- A Telegram bot (for notifications)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd register-a-slot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot** (see Configuration section below)

## Configuration

### 1. Update `config.js`

Edit the `config.js` file with your details:

```javascript
export default {
  // Your credentials
  credentials: {
    name: "Your Full Name",
    citizenId: "Your Citizen ID Number"
  },

  // Form selections
  formData: {
    area: "Thành phố Hồ Chí Minh",
    transactionPoint: "TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC"
  },

  // Telegram configuration
  telegram: {
    enabled: true,
    botToken: "YOUR_BOT_TOKEN",
    chatId: "YOUR_CHAT_ID"
  }
};
```

### 2. Set up Telegram Notifications

#### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the **bot token** (looks like: `7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8`)

#### Step 2: Get Your Chat ID

**Method 1: Using your bot**
1. Start a chat with your bot on Telegram
2. Send any message to your bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":123456789}` in the response
5. That number is your chat ID

**Method 2: Using @userinfobot**
1. Search for `@userinfobot` on Telegram
2. Start a chat and send any message
3. The bot will reply with your user ID (this is your chat ID)

#### Step 3: Update config.js

```javascript
telegram: {
  enabled: true,
  botToken: "7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8", // Your bot token
  chatId: "123456789" // Your chat ID
}
```

### 3. Adjust Timing Settings (Optional)

You can customize timing in `config.js`:

```javascript
timing: {
  // Wait 5-10 seconds before clicking "Not bot" checkbox
  beforeBotCheckMin: 5000,
  beforeBotCheckMax: 10000,

  // Retry every 1-30 minutes
  retryIntervalMin: 1 * 60 * 1000,
  retryIntervalMax: 30 * 60 * 1000
}
```

### 4. Browser Mode

For development, use visible browser:
```javascript
browser: {
  headless: false // You can see what's happening
}
```

For production/server, use headless mode:
```javascript
browser: {
  headless: true // Runs in background
}
```

## Usage

### Start the bot:
```bash
npm start
```

### The bot will:
1. Launch a browser with stealth mode
2. Navigate to the SJC registration page
3. Fill in your credentials
4. Select area and transaction point
5. Wait randomly (5-10s) before clicking "Not bot" checkbox
6. Submit the form
7. Check for success or errors
8. Send you a Telegram notification
9. Retry automatically if failed (with random 1-30 min intervals)
10. Stop when successful

### Stop the bot:
Press `Ctrl+C` to gracefully shut down the bot.

## How It Works

### Bot Detection Evasion

The bot uses multiple techniques to avoid detection:

1. **Puppeteer Stealth Plugin**: Removes automation signatures
2. **Human-like Mouse Movement**: Uses Bezier curves for natural movement
3. **Random Delays**: Varies timing to appear human
4. **Typing Simulation**: Types with natural speed and occasional "typos"
5. **User Agent Spoofing**: Appears as a real Chrome browser
6. **WebDriver Property Hiding**: Removes automation indicators
7. **Random Think Time**: Adds pauses between actions

### Mouse Movement Algorithm

The bot uses Bezier curves to create smooth, human-like mouse paths:

```
Current Position → Control Point 1 → Control Point 2 → Target Position
```

Each movement has:
- Random control points for curve variation
- Variable speed with micro-pauses
- Random final position within element bounds

### Retry Logic

When registration fails:
1. Bot detects error modal or message
2. Sends failure notification via Telegram
3. Waits a random time (configured range: 1-30 minutes)
4. Reloads page for fresh session
5. Tries again until successful or max retries reached

## Error Handling

The bot handles various scenarios:

- **Session Expired**: Automatically refreshes and retries
- **Network Errors**: Waits and retries
- **Element Not Found**: Tries multiple selectors
- **Bot Detection**: Human-like behavior to evade
- **Form Validation Errors**: Reports via Telegram

## Logging

The bot provides detailed, color-coded logs:

```
[2024-01-15 10:30:45] [INFO] Starting registration attempt #1...
[2024-01-15 10:30:46] [SUCCESS] Page loaded successfully
[2024-01-15 10:30:48] [SUCCESS] Name entered
[2024-01-15 10:30:50] [SUCCESS] Citizen ID entered
[2024-01-15 10:30:55] [SUCCESS] Bot checkbox clicked successfully
[2024-01-15 10:30:57] [SUCCESS] Form submitted successfully
[2024-01-15 10:30:59] [SUCCESS] Registration completed successfully!
```

## Notifications

You'll receive Telegram notifications for:

- ✅ **Bot Startup**: When bot starts running
- ✅ **Successful Registration**: With all details
- ❌ **Failed Attempts**: With error messages
- 🔄 **Retry Information**: Next attempt time

Example notification:
```
🎉 SJC Slot Registration - SUCCESS

✅ Successfully registered slot!

Details:
👤 Name: Nguyễn Thị Thu Hương
🆔 Citizen ID: 031193003423
📍 Area: Thành phố Hồ Chí Minh
🏢 Point: TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC

⏰ Time: 15/01/2024, 10:30:59
🔄 Attempt: #3
```

## Troubleshooting

### Bot is detected despite stealth mode

Try adjusting these settings in `config.js`:

```javascript
timing: {
  beforeBotCheckMin: 8000,  // Increase wait time
  beforeBotCheckMax: 15000
}

browser: {
  slowMo: 100  // Slow down all actions more
}
```

### Telegram notifications not working

1. Verify bot token is correct
2. Ensure you've sent at least one message to your bot
3. Check that chat ID is correct (should be a number, not username)
4. Test with: `https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=test`

### Elements not found

The website structure may have changed. Update selectors in `index.js`:

```javascript
// Example: Update name input selector
const nameSelector = 'input[name="fullname"]'; // Update this
```

### Browser crashes or freezes

Try these settings:

```javascript
browser: {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
}
```

## Advanced Configuration

### Disable Image Loading (Faster)

Already enabled by default in `index.js`:

```javascript
this.page.on('request', (request) => {
  if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
    request.abort();
  } else {
    request.continue();
  }
});
```

### Change Retry Strategy

In `config.js`:

```javascript
// Try every 5 minutes
retryIntervalMin: 5 * 60 * 1000,
retryIntervalMax: 5 * 60 * 1000,

// Or try every 10-20 minutes
retryIntervalMin: 10 * 60 * 1000,
retryIntervalMax: 20 * 60 * 1000,
```

### Limit Retry Attempts

```javascript
// Try maximum 10 times
maxRetries: 10,

// Or try indefinitely
maxRetries: 0,
```

## Security Recommendations

⚠️ **Important Security Notes:**

1. **Never commit sensitive data**:
   - Keep credentials in `config.js` (already in .gitignore)
   - Never share your Telegram bot token publicly
   - Consider using environment variables for production

2. **Use environment variables** (optional):
   ```javascript
   // In config.js
   telegram: {
     botToken: process.env.TELEGRAM_BOT_TOKEN || "fallback-token",
     chatId: process.env.TELEGRAM_CHAT_ID || ""
   }
   ```

3. **Secure your bot**:
   - Only you should have access to your Telegram bot
   - Don't share bot token with anyone
   - Regenerate token if compromised (via @BotFather)

4. **Monitor bot activity**:
   - Check Telegram notifications regularly
   - Review logs for suspicious activity

## Technical Details

### Dependencies

- **puppeteer**: Headless browser automation
- **puppeteer-extra**: Plugin framework for Puppeteer
- **puppeteer-extra-plugin-stealth**: Bot detection evasion
- **axios**: HTTP client for Telegram API
- **dotenv**: Environment variable management (optional)

### Browser Configuration

The bot launches Chrome with these optimizations:
- Stealth mode enabled
- Automation flags removed
- Realistic user agent
- Vietnamese language preference
- 1920x1080 viewport
- GPU acceleration disabled (stability)

### Performance

- Average attempt duration: 30-60 seconds
- Memory usage: ~200-300 MB
- CPU usage: Low (mostly waiting)
- Network: Minimal (images blocked)

## Development

### Project Structure

```
register-a-slot/
├── index.js          # Main bot logic
├── config.js         # Configuration
├── utils.js          # Helper functions
├── package.json      # Dependencies
├── .gitignore        # Git ignore rules
├── .env.example      # Environment template
└── README.md         # This file
```

### Adding Features

To add new features:

1. Add configuration to `config.js`
2. Implement logic in `index.js` or `utils.js`
3. Add error handling
4. Update README

### Debugging

Enable verbose logging:

```javascript
// In config.js
verbose: true
```

Take screenshots on error:

```javascript
// Add to index.js in catch blocks
await this.page.screenshot({ path: 'error.png', fullPage: true });
```

## FAQ

**Q: Is this legal?**
A: This bot automates form filling for legitimate registration purposes. Ensure you comply with the website's terms of service.

**Q: Will I get banned?**
A: The bot uses stealth techniques and human-like behavior to minimize detection risk. However, no guarantee is provided.

**Q: Can I run multiple instances?**
A: Not recommended. The website likely tracks by citizen ID. Running multiple instances may trigger detection.

**Q: Does it work on a server?**
A: Yes! Set `headless: true` in config.js and ensure the server has Chrome dependencies:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y chromium-browser
```

**Q: Can I modify the form fields?**
A: Yes! Update `config.js` with your preferred area and transaction point.

**Q: What if the website changes?**
A: You may need to update selectors in `index.js`. Check browser console to find new element IDs/classes.

## Support

For issues or questions:

1. Check the Troubleshooting section
2. Review logs for error messages
3. Verify configuration settings
4. Test Telegram notifications independently

## License

MIT License - See LICENSE file for details

## Disclaimer

This tool is provided for educational and personal use only. The authors are not responsible for any misuse or damage caused by this software. Use at your own risk and ensure compliance with all applicable laws and terms of service.

---

**Made with ❤️ for SJC slot registration automation**
