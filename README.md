# SJC Slot Registration Bot

Automated bot for registering time slots on the SJC (Saigon Jewelry Company) website with advanced bot detection evasion.

## 📑 Table of Contents

- [Features](#features)
- [Quick Start](#-quick-start)
- [Complete Setup Guide](#-complete-setup-guide)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Telegram Bot Setup](#telegram-bot-setup)
  - [Configuration](#configuration)
  - [Testing](#testing)
- [Running the Bot](#-running-the-bot)
- [Troubleshooting](#-troubleshooting)
- [Advanced Features](#-advanced-features)
- [Configuration Examples](#configuration-examples)
- [FAQ](#faq)

---

## Features

- ✅ **Bot Detection Evasion**: Uses Puppeteer Stealth plugin and human-like behavior
- 🤖 **Advanced Mouse Movement**: Multiple patterns (Bezier, Arc, Zigzag) with overshoot, jitter, and pauses
- 🎯 **Human-like Interactions**: Natural typing with typos/corrections, random delays
- 🔄 **Smart Retry Logic**: Configurable retry intervals (1-30 minutes)
- 📱 **Telegram Notifications**: Real-time updates on success/failure
- 📧 **Email Notifications**: Beautiful HTML email reports (Gmail, Outlook, SMTP)
- ⚙️ **Fully Configurable**: Extensive configuration through `config.js`
- 🎨 **Automatic Form Filling**: Handles complex dropdowns and bot checkboxes
- 🛡️ **Session Management**: Detects and handles session expiration
- 📊 **Detailed Logging**: Color-coded logs with timestamps

> 📖 **See [FEATURES.md](FEATURES.md) for detailed documentation on advanced features**

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/khangkhangg/register-a-slot.git
cd register-a-slot
npm install

# 2. Create Telegram bot (@BotFather) and get chat ID
node get-chat-id.js YOUR_BOT_TOKEN

# 3. Configure config.js with your details
# Edit: credentials, telegram botToken and chatId

# 4. Test Telegram
npm run test:telegram

# 5. Run the bot
npm start
```

**For detailed step-by-step instructions, see [Complete Setup Guide](#-complete-setup-guide) below.**

---

## 📋 Complete Setup Guide

### Prerequisites

Before starting, ensure you have:

1. **Node.js** (version 18 or higher)
   ```bash
   # Check version
   node --version

   # If not installed, download from:
   # https://nodejs.org/
   ```

2. **Git** (to clone repository)
   ```bash
   git --version
   ```

3. **A Telegram account**

4. **Chrome/Chromium** browser (auto-installed by Puppeteer)

---

### Installation

**Step 1: Clone the repository**

```bash
# Navigate to your desired directory
cd ~/Documents  # or any directory you prefer

# Clone the repository
git clone https://github.com/khangkhangg/register-a-slot.git

# Or download ZIP and extract it

# Navigate to project folder
cd register-a-slot
```

**Step 2: Install dependencies**

```bash
npm install
```

This will install all required packages. Takes 1-2 minutes.

**Expected output:**
```
added 180 packages, and audited 181 packages in 45s
```

---

### Telegram Bot Setup

#### Step 1: Create a Telegram Bot

1. Open **Telegram** (mobile or desktop)
2. Search for **@BotFather**
3. Start a chat and send: `/newbot`
4. Follow the prompts:
   - **Bot name**: `My SJC Bot` (or any name)
   - **Bot username**: `my_sjc_slot_bot` (must end with 'bot')
5. **Copy the bot token** that looks like:
   ```
   7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8
   ```

#### Step 2: Get Your Chat ID

**Method 1: Using the helper script (Recommended)**

```bash
# First, start a chat with your bot and send any message
# Then run:
node get-chat-id.js YOUR_BOT_TOKEN

# Example:
node get-chat-id.js 7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8
```

**Output:**
```
✅ Found messages! Here are your chat IDs:

Chat ID: 123456789
Name: John Doe
Username: @johndoe
```

**Method 2: Using @userinfobot**

1. Search for **@userinfobot** on Telegram
2. Send any message
3. It will reply with your User ID (this is your chat ID)

**Method 3: Manual (using browser)**

1. Start a chat with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":123456789}`
5. That number is your chat ID

**Save both values:**
- ✅ Bot Token: `7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8`
- ✅ Chat ID: `123456789`

---

### Configuration

**Step 1: Open config.js in a text editor**

```bash
# Use any text editor
nano config.js
# or
code config.js  # VS Code
# or
vim config.js
```

**Step 2: Update the following sections**

```javascript
export default {
  // 1. YOUR PERSONAL INFORMATION
  credentials: {
    name: "Nguyễn Thị Thu Hương",      // ✏️ YOUR FULL NAME
    citizenId: "031193003423"          // ✏️ YOUR CITIZEN ID
  },

  // 2. FORM SELECTIONS (already configured)
  formData: {
    area: "Thành phố Hồ Chí Minh",
    transactionPoint: "TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC"
  },

  // 3. TIMING (already optimized)
  timing: {
    beforeBotCheckMin: 5000,           // Wait 5-10 seconds before checkbox
    beforeBotCheckMax: 10000,
    retryIntervalMin: 1 * 60 * 1000,   // Retry every 1-30 minutes if failed
    retryIntervalMax: 30 * 60 * 1000
  },

  // 4. TELEGRAM NOTIFICATIONS (REQUIRED)
  telegram: {
    enabled: true,
    botToken: "YOUR_BOT_TOKEN",        // ✏️ PASTE YOUR BOT TOKEN HERE
    chatId: "YOUR_CHAT_ID"             // ✏️ PASTE YOUR CHAT ID HERE
  },

  // 5. EMAIL NOTIFICATIONS (OPTIONAL - can skip for now)
  email: {
    enabled: false,  // Set to true if you want email notifications
    service: "gmail",
    user: "your-email@gmail.com",
    password: "your-app-password",
    to: "recipient@email.com"
  },

  // 6. MOUSE MOVEMENT (already optimized)
  mouseMovement: {
    pattern: 'bezier',           // Smooth curved movement
    speed: 'medium',             // Natural speed
    complexity: 5,               // Balanced randomization
    overshoot: true,             // Overshoots target sometimes
    jitter: true,                // Small hand tremors
    pauseProbability: 0.2        // 20% chance of pause
  },

  // 7. BROWSER SETTINGS
  browser: {
    headless: false,  // Set to false to see the browser (recommended for first run)
    slowMo: 50        // Slow down actions by 50ms
  },

  // 8. OTHER SETTINGS (already optimized)
  maxRetries: 0,      // 0 = infinite retries (will keep trying until success)
  verbose: true       // Show detailed logs
};
```

**Step 3: Save the file** (Ctrl+S or Cmd+S)

---

### Testing

**Test Telegram Notifications**

Before running the full bot, test that Telegram works:

```bash
npm run test:telegram
```

**Expected output:**
```
🧪 Testing Telegram notification...

📤 Sending test message...
Bot Token: 7730228914:AAHFsw8O...
Chat ID: 123456789

✅ Test message sent successfully!
📱 Check your Telegram to see the message

✨ Your bot is ready to use!
Run: npm start
```

**✅ Check your Telegram** - you should receive a test message!

**If the test fails:**
- Verify bot token is correct
- Verify chat ID is correct
- Make sure you sent a message to your bot first
- Check internet connection

---

## 🏃 Running the Bot

### Start the Bot

```bash
npm start
```

### What Happens

The bot will:

1. **Launch Browser** - Chrome/Chromium window opens (if headless: false)
2. **Navigate** - Goes to https://tructuyen.sjc.com.vn/dang-nhap
3. **Fill Form** - Enters name and citizen ID
4. **Select Options** - Chooses area and transaction point from dropdowns
5. **Wait** - Randomly waits 5-10 seconds (human-like behavior)
6. **Move Mouse** - Natural Bezier curve movement to checkbox
7. **Click Checkbox** - Clicks "Not bot" checkbox
8. **Submit** - Clicks registration button
9. **Check Result** - Looks for success or error messages
10. **Notify** - Sends Telegram notification with result
11. **Retry** - If failed, waits 1-30 minutes and tries again

### Console Output

```
[06/11/2024, 10:30:00] [INFO] Initializing browser with stealth mode...
[06/11/2024, 10:30:03] [SUCCESS] Browser initialized successfully
[06/11/2024, 10:30:05] [INFO] ============================================================
[06/11/2024, 10:30:05] [INFO] Starting registration attempt #1...
[06/11/2024, 10:30:05] [INFO] ============================================================
[06/11/2024, 10:30:08] [SUCCESS] Page loaded successfully
[06/11/2024, 10:30:10] [SUCCESS] Name entered
[06/11/2024, 10:30:12] [SUCCESS] Citizen ID entered
[06/11/2024, 10:30:14] [SUCCESS] Area selected: Thành phố Hồ Chí Minh
[06/11/2024, 10:30:16] [SUCCESS] Transaction point selected: TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC
[06/11/2024, 10:30:18] [INFO] Waiting 7 seconds before checkbox...
[06/11/2024, 10:30:25] [SUCCESS] Bot checkbox clicked successfully
[06/11/2024, 10:30:27] [SUCCESS] Form submitted successfully
[06/11/2024, 10:30:29] [SUCCESS] Registration completed successfully!
[06/11/2024, 10:30:30] [SUCCESS] Telegram notification sent

🎉 Registration successful! Bot will now stop.
```

### Telegram Notifications

**Success Message:**
```
🎉 SJC Slot Registration - SUCCESS

✅ Successfully registered slot!

Details:
👤 Name: Nguyễn Thị Thu Hương
🆔 Citizen ID: 031193003423
📍 Area: Thành phố Hồ Chí Minh
🏢 Transaction Point: TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC
🔄 Attempt: #1

⏰ Time: 06/11/2024, 10:30:30
```

**Failure Message (will retry):**
```
⚠️ SJC Slot Registration - FAILED

❌ Registration attempt failed

Error:
Phiên làm việc hết hạn hoặc bạn đang sử dụng đồng thời tab khác...

Details:
👤 Name: Nguyễn Thị Thu Hương
🆔 Citizen ID: 031193003423
📍 Area: Thành phố Hồ Chí Minh
🏢 Transaction Point: TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC
🔄 Attempt: #1

⏰ Time: 06/11/2024, 10:35:00

🔄 Will retry shortly...
```

### Stop the Bot

Press **Ctrl + C** in the terminal:

```
^C
[06/11/2024, 10:45:00] [WARNING] Received SIGINT signal. Shutting down gracefully...
[06/11/2024, 10:45:01] [INFO] Cleaning up resources...

Bot stopped. Total attempts: 3, Successes: 0
```

---

## 🔧 Troubleshooting

### Problem 1: "npm: command not found"

**Cause:** Node.js is not installed

**Solution:**
```bash
# Check if Node.js is installed
node --version

# If not, install from https://nodejs.org/
# Download and install the LTS version
```

---

### Problem 2: "Cannot find module" or dependencies missing

**Cause:** Dependencies not installed

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

### Problem 3: Telegram test fails

**Possible causes and solutions:**

**A. Invalid bot token**
- Double-check you copied the full token from @BotFather
- Token should look like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
- No spaces or extra characters

**B. Invalid chat ID**
- Make sure you sent a message to your bot first
- Run `node get-chat-id.js YOUR_TOKEN` again
- Chat ID should be a number, not a username

**C. Bot blocked**
- Unblock the bot in Telegram
- Send `/start` to your bot
- Try again

**Test manually:**
```bash
# Replace with your token and chat ID
curl "https://api.telegram.org/bot7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8/sendMessage?chat_id=123456789&text=test"
```

---

### Problem 4: Browser doesn't open

**Cause:** Chrome/Chromium not installed properly

**Solution:**

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y chromium-browser \
  libnss3 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libxkbcommon0 \
  libgbm1
```

**macOS:**
```bash
# Puppeteer usually installs Chrome automatically
# If issues, install Chrome manually
brew install --cask google-chrome
```

**Windows:**
- Download Chrome from https://www.google.com/chrome/
- Restart terminal after installation

---

### Problem 5: "Element not found" errors

**Cause:** Website structure changed or elements loading slowly

**Solutions:**

**A. Increase timeouts:**
```javascript
// In config.js
timing: {
  pageLoadTimeout: 90000,      // Increase to 90 seconds
  navigationTimeout: 60000
}
```

**B. Check website manually:**
- Visit https://tructuyen.sjc.com.vn/dang-nhap
- Verify form is accessible
- Check if structure has changed

**C. Update selectors:**
- Open browser console (F12)
- Inspect form elements
- Update selectors in `index.js` if needed

---

### Problem 6: Bot gets detected / Form doesn't submit

**Solutions:**

**A. Increase stealth:**
```javascript
// In config.js
timing: {
  beforeBotCheckMin: 8000,   // Wait 8-15 seconds
  beforeBotCheckMax: 15000
},

mouseMovement: {
  pattern: 'random',          // Use random patterns
  speed: 'random',            // Vary speed
  complexity: 8,              // Higher complexity
  overshoot: true,
  jitter: true
},

browser: {
  slowMo: 100                 // Slow down more
}
```

**B. Use headless mode:**
```javascript
browser: {
  headless: true  // Sometimes headless is less detectable
}
```

**C. Increase retry interval:**
```javascript
timing: {
  retryIntervalMin: 10 * 60 * 1000,  // 10 minutes
  retryIntervalMax: 20 * 60 * 1000   // 20 minutes
}
```

---

### Problem 7: Browser crashes or freezes

**Solutions:**

```javascript
// In config.js
browser: {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-dev-shm-usage'
  ]
}
```

**For low-memory systems:**
```javascript
browser: {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--single-process',        // Use single process
    '--no-zygote'
  ]
}
```

---

### Problem 8: Session expired error keeps appearing

**Cause:** Website detects multiple tabs or sessions

**Solutions:**

**A. Only run one instance:**
- Don't open the website manually while bot is running
- Don't run multiple bot instances
- Close other browser tabs for that website

**B. Increase wait time before retry:**
```javascript
timing: {
  retryIntervalMin: 15 * 60 * 1000,  // Wait 15-30 minutes
  retryIntervalMax: 30 * 60 * 1000
}
```

**C. Clear cookies between attempts:**
The bot already reloads the page, but you can add this to `index.js`:
```javascript
// After reload, add:
await this.page.deleteCookie(...(await this.page.cookies()));
```

---

### Problem 9: Mouse movement looks robotic

**Solution:** Adjust mouse movement settings

```javascript
// In config.js
mouseMovement: {
  pattern: 'random',           // Varies each time
  speed: 'random',             // Varies speed
  complexity: 8,               // Higher = more natural
  overshoot: true,
  overshootProbability: 0.4,   // 40% chance
  jitter: true,
  jitterIntensity: 0.7,        // More jitter
  pauseProbability: 0.3,       // More pauses
  pauseDuration: [100, 500]    // Longer pauses
}
```

---

### Problem 10: Need to run on server (VPS)

**For Ubuntu/Debian servers:**

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install Chrome dependencies
sudo apt-get install -y \
  chromium-browser \
  libnss3 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libxkbcommon0 \
  libgbm1 \
  libasound2

# 3. Clone and setup
git clone https://github.com/khangkhangg/register-a-slot.git
cd register-a-slot
npm install

# 4. Configure config.js with headless mode
# Edit config.js and set:
# browser: { headless: true }

# 5. Run with process manager
npm install -g pm2
pm2 start index.js --name sjc-bot
pm2 logs sjc-bot
pm2 save
pm2 startup
```

---

## 🎨 Advanced Features

### 📧 Email Notifications

Get beautiful HTML email notifications in addition to Telegram:

**Quick Setup (Gmail):**

1. **Enable 2-Step Verification:**
   - Visit: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" > "Other"
   - Copy 16-character password

3. **Configure in config.js:**
   ```javascript
   email: {
     enabled: true,
     service: "gmail",
     user: "your-email@gmail.com",
     password: "xxxx xxxx xxxx xxxx",  // 16-char app password
     to: "recipient@email.com"
   }
   ```

4. **Test:**
   ```bash
   npm run test:email
   ```

**📖 See [FEATURES.md](FEATURES.md#email-notifications) for detailed setup (Outlook, Yahoo, SMTP)**

---

### 🖱️ Advanced Mouse Movement Patterns

Customize mouse behavior for maximum stealth:

**Patterns:**
- **bezier**: Smooth curved paths (default)
- **arc**: Parabolic arc motion
- **zigzag**: Slightly erratic movement
- **random**: Randomly varies (most stealthy)

**Configuration:**
```javascript
mouseMovement: {
  pattern: 'random',           // Choose pattern
  speed: 'medium',             // slow/medium/fast/random
  complexity: 7,               // 1-10 (higher = more human-like)
  overshoot: true,             // Mouse overshoots target
  overshootProbability: 0.35,  // 35% chance
  jitter: true,                // Hand tremor simulation
  jitterIntensity: 0.6,        // 0-1 scale
  pauseProbability: 0.25,      // 25% chance of pause
  pauseDuration: [80, 400]     // Pause duration range (ms)
}
```

**📖 See [FEATURES.md](FEATURES.md#advanced-mouse-movement-patterns) for detailed explanation**

---

## Configuration Examples

### Maximum Stealth (Heavily Monitored Sites)

```javascript
export default {
  credentials: {
    name: "Your Name",
    citizenId: "Your ID"
  },

  timing: {
    beforeBotCheckMin: 10000,        // 10-15 seconds
    beforeBotCheckMax: 15000,
    retryIntervalMin: 10 * 60 * 1000,  // 10-30 minutes
    retryIntervalMax: 30 * 60 * 1000
  },

  telegram: {
    enabled: true,
    botToken: "YOUR_TOKEN",
    chatId: "YOUR_CHAT_ID"
  },

  mouseMovement: {
    pattern: 'random',
    speed: 'random',
    complexity: 9,
    overshoot: true,
    overshootProbability: 0.45,
    jitter: true,
    jitterIntensity: 0.8,
    pauseProbability: 0.35,
    pauseDuration: [150, 600]
  },

  browser: {
    headless: false,
    slowMo: 150
  }
};
```

### Balanced (Recommended)

```javascript
export default {
  credentials: {
    name: "Your Name",
    citizenId: "Your ID"
  },

  timing: {
    beforeBotCheckMin: 5000,
    beforeBotCheckMax: 10000,
    retryIntervalMin: 5 * 60 * 1000,
    retryIntervalMax: 15 * 60 * 1000
  },

  telegram: {
    enabled: true,
    botToken: "YOUR_TOKEN",
    chatId: "YOUR_CHAT_ID"
  },

  mouseMovement: {
    pattern: 'bezier',
    speed: 'medium',
    complexity: 5,
    overshoot: true,
    overshootProbability: 0.3,
    jitter: true,
    jitterIntensity: 0.5,
    pauseProbability: 0.2,
    pauseDuration: [50, 300]
  },

  browser: {
    headless: false,
    slowMo: 50
  }
};
```

### Fast (Speed Priority)

```javascript
export default {
  credentials: {
    name: "Your Name",
    citizenId: "Your ID"
  },

  timing: {
    beforeBotCheckMin: 3000,
    beforeBotCheckMax: 5000,
    retryIntervalMin: 1 * 60 * 1000,
    retryIntervalMax: 5 * 60 * 1000
  },

  telegram: {
    enabled: true,
    botToken: "YOUR_TOKEN",
    chatId: "YOUR_CHAT_ID"
  },

  mouseMovement: {
    pattern: 'bezier',
    speed: 'fast',
    complexity: 3,
    overshoot: false,
    jitter: false,
    pauseProbability: 0.1,
    pauseDuration: [20, 100]
  },

  browser: {
    headless: true,
    slowMo: 20
  }
};
```

---

## FAQ

**Q: Is this legal?**
A: This bot automates form filling for legitimate personal registration. Ensure you comply with the website's terms of service.

**Q: Will I get banned?**
A: The bot uses advanced stealth techniques to minimize detection. However, no guarantee is provided. Use responsibly.

**Q: Can I run multiple instances?**
A: Not recommended. The website tracks by citizen ID. Multiple instances may trigger detection.

**Q: Does it work on a server/VPS?**
A: Yes! Set `headless: true` in config.js. See [Problem 10](#problem-10-need-to-run-on-server-vps) for server setup.

**Q: Can I change the area or transaction point?**
A: Yes! Edit the `formData` section in `config.js`:
```javascript
formData: {
  area: "Your Area",
  transactionPoint: "Your Preferred Point"
}
```

**Q: What if the website changes?**
A: You may need to update element selectors in `index.js`. Open browser console (F12) to find new selectors.

**Q: How do I stop the bot?**
A: Press `Ctrl+C` in the terminal. The bot will shut down gracefully.

**Q: Can I use this without Telegram?**
A: Telegram is required for notifications. You could disable it in code, but notifications are essential for knowing when slots are registered.

**Q: How long does each attempt take?**
A: Typically 30-60 seconds per attempt, including delays to appear human.

**Q: What happens if I close the terminal?**
A: The bot stops. For continuous running, use a process manager like `pm2` (see Problem 10).

---

## 📚 Additional Resources

- **Quick Start Guide:** [QUICKSTART.md](QUICKSTART.md) - Get running in 5 minutes
- **Advanced Features:** [FEATURES.md](FEATURES.md) - Comprehensive 1000+ line guide
- **Configuration File:** `config.js` - All settings with detailed comments
- **Test Scripts:**
  - `npm run test:telegram` - Test Telegram notifications
  - `npm run test:email` - Test email notifications
  - `npm run get:chatid` - Get Telegram chat ID

---

## 🛡️ Security Recommendations

⚠️ **Important:**

1. **Never commit sensitive data:**
   - `config.js` is in `.gitignore` for a reason
   - Never share your Telegram bot token publicly
   - Never commit credentials to git

2. **Use environment variables (optional but recommended):**
   ```javascript
   // In config.js
   telegram: {
     botToken: process.env.TELEGRAM_BOT_TOKEN || "fallback",
     chatId: process.env.TELEGRAM_CHAT_ID || ""
   }
   ```

3. **Secure your Telegram bot:**
   - Only you should have access
   - Don't share the bot token with anyone
   - If compromised, regenerate via @BotFather: `/revoke`

4. **Monitor regularly:**
   - Check Telegram notifications
   - Review console logs
   - Watch for suspicious activity

---

## 📊 Technical Details

### Dependencies

- `puppeteer` v22.0.0 - Headless browser automation
- `puppeteer-extra` v3.3.6 - Plugin framework
- `puppeteer-extra-plugin-stealth` v2.11.2 - Bot detection evasion
- `axios` v1.6.0 - HTTP client for notifications
- `nodemailer` v6.9.7 - Email notifications
- `dotenv` v16.3.1 - Environment variables

### Browser Configuration

- Stealth mode enabled
- Automation flags removed
- Realistic user agent
- Vietnamese language preference
- 1920x1080 viewport
- Image/stylesheet blocking for speed

### Performance

- Average attempt: 30-60 seconds
- Memory usage: ~200-300 MB
- CPU usage: Low (mostly waiting)
- Network: Minimal (images blocked)

---

## 📝 Project Structure

```
register-a-slot/
├── index.js              # Main bot logic
├── config.js             # User configuration
├── utils.js              # Helper functions (mouse, notifications, etc.)
├── get-chat-id.js        # Telegram chat ID helper
├── test-telegram.js      # Telegram test script
├── test-email.js         # Email test script
├── package.json          # Dependencies and scripts
├── .gitignore            # Git ignore rules
├── .env.example          # Environment variable template
├── LICENSE               # MIT License
├── README.md             # This file
├── QUICKSTART.md         # Quick start guide
└── FEATURES.md           # Advanced features documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## ⚠️ Disclaimer

This tool is provided for **educational and personal use only**. The authors are not responsible for any misuse or damage caused by this software. Use at your own risk and ensure compliance with all applicable laws and terms of service.

**Important:**
- This bot is for legitimate personal slot registration
- Do not use for commercial purposes
- Respect the website's terms of service
- Use responsibly and ethically

---

## 💬 Support

Need help?

1. ✅ Check [Troubleshooting](#-troubleshooting) section
2. ✅ Review [FAQ](#faq)
3. ✅ Read [FEATURES.md](FEATURES.md) for advanced topics
4. ✅ Check console logs for errors
5. ✅ Test components separately (Telegram, email)

---

## ✅ Quick Checklist

Before running the bot:

- [ ] Node.js installed (`node --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Telegram bot created (via @BotFather)
- [ ] Chat ID obtained
- [ ] `config.js` updated with credentials
- [ ] `config.js` updated with bot token
- [ ] `config.js` updated with chat ID
- [ ] Telegram test passed (`npm run test:telegram`)
- [ ] Chrome/Chromium available

**Then run:** `npm start`

---

**Made with ❤️ for SJC slot registration automation**

**Good luck with your slot registration! 🚀**
