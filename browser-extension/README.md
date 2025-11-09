# 🌐 SJC Slot Registration Bot - Browser Extension

A browser extension that automates SJC slot registration directly in your browser. No Node.js or command line needed!

---

## 🚀 New to This?

**👉 [Start with the 5-Minute Quick Start Guide](../QUICKSTART-EXTENSION.md)**

This README is comprehensive. If you just want to get started quickly, use the Quick Start guide above!

---

## ✨ Features

- ✅ **No Installation Required** - Just load the extension
- ✅ **User-Friendly Interface** - Beautiful popup UI
- ✅ **Human-like Behavior** - Multiple mouse movement patterns
- ✅ **Bot Detection Evasion** - Natural delays and interactions
- ✅ **Telegram Notifications** - Get notified instantly
- ✅ **Auto Retry** - Automatically retries on failure
- ✅ **Visual Feedback** - See what the bot is doing in real-time
- ✅ **Configurable** - Customize all settings
- ✅ **Works Offline** - No external dependencies

## 📦 Installation

### Chrome / Edge / Brave

1. **Download the extension:**
   - Clone the repository or download ZIP
   - Extract to a folder

2. **Generate icons** (first time only):
   - Open `icons/icon-generator.html` in your browser
   - Click each icon to download
   - Save as icon16.png, icon32.png, icon48.png, icon128.png in the `icons/` folder

3. **Load the extension:**
   - Open Chrome/Edge
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `browser-extension` folder
   - The extension should now appear in your toolbar

### Firefox

1. **Download the extension:**
   - Clone the repository or download ZIP
   - Extract to a folder

2. **Generate icons** (see Chrome instructions above)

3. **Run Firefox setup script** (IMPORTANT):

   Firefox requires Manifest V2, so run the setup script to switch the manifest:

   **Unix/Linux/Mac:**
   ```bash
   cd browser-extension
   ./setup-firefox.sh
   ```

   **Windows:**
   ```cmd
   cd browser-extension
   setup-firefox.bat
   ```

   This will:
   - Backup your Chrome manifest to `manifest-chrome.json`
   - Copy `manifest-firefox.json` to `manifest.json`

4. **Load the extension temporarily:**
   - Open Firefox
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file in the `browser-extension` folder
   - The extension will be loaded (until you close Firefox)

**Note:**
- Extension will be removed when Firefox closes
- For permanent installation in Firefox, you need to sign the extension through Mozilla
- To switch back to Chrome: `cp manifest-chrome.json manifest.json`

## 🚀 Quick Start

### Step 1: Configure the Extension

1. Click the extension icon in your toolbar
2. Go to "Cấu hình" (Configuration) tab
3. Fill in your information:
   - **Họ và tên** (Full name)
   - **Số CCCD** (Citizen ID)
   - **Khu vực** (Area)
   - **Điểm giao dịch** (Transaction point)

### Step 2: Setup Telegram (Optional)

1. Create a Telegram bot:
   - Search for `@BotFather` on Telegram
   - Send `/newbot`
   - Follow instructions
   - Copy the bot token

2. Get your Chat ID:
   - Send a message to your bot
   - In the extension, paste your bot token
   - Click "Lấy Chat ID" button
   - Your chat ID will be auto-filled

3. Test:
   - Click "Test Telegram" button
   - You should receive a test message

### Step 3: Adjust Settings

**Timing:**
- **Chờ trước khi click checkbox**: How long to wait before clicking bot checkbox (3-15 seconds)
- **Thử lại sau khi thất bại**: Retry interval if registration fails (1-30 minutes)
- **Tự động thử lại**: Enable/disable auto-retry

**Advanced (Optional):**
- Mouse movement pattern (Bezier, Arc, Zigzag, Random)
- Mouse speed (Slow, Medium, Fast, Random)
- Complexity (1-10)
- Overshoot, Jitter, Random pauses

### Step 4: Save Configuration

Click **"💾 Lưu cấu hình"** (Save Configuration)

### Step 5: Run the Bot

1. Open the SJC registration page:
   - Go to https://tructuyen.sjc.com.vn/dang-nhap

2. Click the extension icon

3. Click **"▶️ Bắt đầu"** (Start)

4. Watch the bot work:
   - A colored overlay will appear showing progress
   - Bot will fill the form automatically
   - You'll see each step in real-time
   - Receive Telegram notification when done

5. Stop if needed:
   - Click **"⏹️ Dừng lại"** (Stop) in the overlay or extension popup

## 📖 How It Works

### The Bot Process:

1. **Fills Name** - Types your name naturally
2. **Fills Citizen ID** - Enters your CCCD number
3. **Selects Area** - Chooses your area from dropdown
4. **Selects Transaction Point** - Picks transaction location
5. **Waits** - Random delay (5-10 seconds) to appear human
6. **Clicks Checkbox** - Clicks "Not bot" checkbox
7. **Submits Form** - Clicks registration button
8. **Checks Result** - Verifies success or error
9. **Notifies** - Sends Telegram message
10. **Retries** - If failed and auto-retry enabled

### Human-like Behavior:

- **Natural typing** - Types one character at a time with delays
- **Mouse movements** - Uses Bezier curves or other patterns
- **Random delays** - Varies timing to appear human
- **Overshoot** - Sometimes moves past target then corrects
- **Jitter** - Adds small random movements
- **Pauses** - Random thinking time between actions

## 🎨 User Interface

### Popup Tabs:

**Cấu hình (Configuration):**
- Personal information
- Registration details
- Telegram settings
- Timing settings

**Nâng cao (Advanced):**
- Mouse movement patterns
- Speed settings
- Complexity control
- Behavior options

**Giới thiệu (About):**
- Extension information
- Features list
- Instructions
- Links to documentation

### Status Indicator:

- **Gray dot** - Not configured
- **Green dot** - Ready/Success
- **Yellow dot** - Running
- **Red dot** - Error

### On-Page Overlay:

When the bot runs, you'll see:
- Current step and progress
- Status indicator
- Stop button
- Real-time updates

## 🔧 Configuration Options

### Basic Settings:

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| Full Name | Your full name | Required | - |
| Citizen ID | Your CCCD number | Required | - |
| Area | Registration area | HCM | - |
| Transaction Point | Where to register | HQ | - |
| Bot Token | Telegram bot token | Optional | - |
| Chat ID | Telegram chat ID | Optional | - |
| Before Bot Check Delay | Wait time before checkbox | 7s | 3-15s |
| Retry Interval | Time between retries | 5min | 1-30min |
| Auto Retry | Retry on failure | Yes | Yes/No |

### Advanced Settings:

| Setting | Description | Default | Options |
|---------|-------------|---------|---------|
| Mouse Pattern | Movement style | Bezier | Bezier, Arc, Zigzag, Random |
| Mouse Speed | Movement speed | Medium | Slow, Medium, Fast, Random |
| Complexity | Randomization level | 5 | 1-10 |
| Overshoot | Overshoot target | Yes | Yes/No |
| Jitter | Hand tremor effect | Yes | Yes/No |
| Random Pauses | Thinking time | Yes | Yes/No |
| Natural Typing | Human-like typing | Yes | Yes/No |

## 📱 Telegram Setup

### Creating a Bot:

1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Choose a name (e.g., "My SJC Bot")
5. Choose a username (e.g., "my_sjc_slot_bot")
6. Copy the token (looks like: `1234567890:ABCdefGHI...`)

### Getting Chat ID:

**Method 1: Using Extension (Easiest)**
1. Paste bot token in extension
2. Send any message to your bot on Telegram
3. Click "Lấy Chat ID" in extension
4. Chat ID will be auto-filled

**Method 2: Manual**
1. Send message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. Find `"chat":{"id":123456789}`
4. Copy the number (123456789)

**Method 3: @userinfobot**
1. Search for `@userinfobot` on Telegram
2. Send any message
3. Bot replies with your ID

## 🐛 Troubleshooting

### Extension Won't Load

**Problem:** Error loading extension

**Solution:**
- Make sure all files are in the correct folder structure
- Generate icon files (see Installation)
- Check browser console for errors
- Try in Incognito/Private mode
- Reload the extension

### Firefox: "background.service_worker is currently disabled"

**Problem:** Error loading in Firefox: "background.service_worker is currently disabled. Add background.scripts."

**Solution:**
Firefox requires Manifest V2 (not V3). Run the Firefox setup script:

**Unix/Linux/Mac:**
```bash
cd browser-extension
./setup-firefox.sh
```

**Windows:**
```cmd
cd browser-extension
setup-firefox.bat
```

This will automatically switch to the Firefox-compatible manifest. Then reload the extension.

### Bot Doesn't Start

**Problem:** "Vui lòng mở trang đăng ký SJC trước!"

**Solution:**
- Make sure you're on https://tructuyen.sjc.com.vn/dang-nhap
- Refresh the page
- Try reloading the extension
- Check browser console for errors

### Configuration Not Saved

**Problem:** Settings reset after closing popup

**Solution:**
- Click "Lưu cấu hình" button
- Check browser storage permissions
- Try clearing extension storage and reconfiguring

### Telegram Not Working

**Problem:** Not receiving notifications

**Solution:**
- Verify bot token is correct (no spaces, complete token)
- Verify chat ID is correct (numbers only)
- Send a message to your bot first
- Click "Test Telegram" to verify
- Check Telegram bot is not blocked

### Element Not Found Errors

**Problem:** Bot can't find form elements

**Solution:**
- Make sure page is fully loaded
- Check if SJC website structure changed
- Try refreshing the page
- Update selectors in content.js if needed

### Bot Detected

**Problem:** Form doesn't submit or shows captcha

**Solution:**
- Increase "Before Bot Check Delay" to 10-15 seconds
- Use "Random" mouse pattern
- Increase complexity to 8-10
- Enable all human-like options
- Try again after 15-30 minutes

## 📂 File Structure

```
browser-extension/
├── manifest.json           # Extension configuration
├── popup.html              # Extension popup UI
├── icons/                  # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon-generator.html # Icon generator tool
│   └── README.md
├── css/
│   ├── popup.css           # Popup styling
│   └── content.css         # On-page overlay styling
├── js/
│   ├── popup.js            # Popup logic
│   ├── content.js          # Main bot automation
│   └── background.js       # Background service worker
└── README.md               # This file
```

## 🔒 Privacy & Security

- **No Data Collection** - Extension doesn't collect any data
- **Local Storage** - All settings stored locally in your browser
- **No External Calls** - Except Telegram API (optional)
- **No Tracking** - No analytics or tracking
- **Open Source** - All code is visible and auditable
- **Secure** - Uses standard browser APIs

## ⚖️ Permissions

The extension requires these permissions:

- **storage** - To save your configuration
- **notifications** - To show notifications
- **scripting** - To run on SJC website
- **activeTab** - To interact with current tab
- **host_permissions** - Access to SJC website and Telegram API

## 🆚 Extension vs Node.js Version

| Feature | Extension | Node.js |
|---------|-----------|---------|
| Installation | Load unpacked | npm install |
| Configuration | UI popup | Edit config.js |
| Running | Click button | Terminal command |
| Updates | Reload extension | git pull |
| User-friendly | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Advanced features | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Email notifications | ❌ | ✅ |
| Headless mode | ❌ | ✅ |

**Use Extension if:**
- You want easy setup
- You prefer UI over command line
- You don't need email notifications
- You want to see the bot in action

**Use Node.js if:**
- You need email notifications
- You want to run headless
- You want advanced configuration
- You prefer command line
- You want to run on a server

## 🎯 Tips for Best Results

1. **First Time:**
   - Run with visible browser (not headless)
   - Watch what the bot does
   - Adjust settings if needed

2. **Timing:**
   - Start with 7 seconds before bot check
   - Increase if detected
   - Use 5-minute retry interval

3. **Mouse Movement:**
   - Default (Bezier, Medium, Complexity 5) works well
   - Use "Random" pattern for maximum stealth
   - Increase complexity if detected

4. **Telegram:**
   - Setup Telegram for notifications
   - Test before running bot
   - Check messages regularly

5. **Troubleshooting:**
   - Check browser console for errors
   - Try refreshing the page
   - Reload the extension
   - Check SJC website is accessible

## 📚 Additional Resources

- **Main Documentation:** [../README.md](../README.md)
- **Features Guide:** [../FEATURES.md](../FEATURES.md)
- **Setup Guide:** [../SETUP.md](../SETUP.md)
- **Node.js Version:** [../](../)

## 🤝 Support

Need help?

1. Check this README
2. Check [Troubleshooting](#-troubleshooting)
3. Open an issue on GitHub
4. Check browser console for errors

## 📄 License

MIT License - See [../LICENSE](../LICENSE)

## ⚠️ Disclaimer

This extension is for educational and personal use only. Use responsibly and ensure compliance with website terms of service.

---

**Made with ❤️ for easy SJC slot registration**
