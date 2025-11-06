# 🚀 Browser Extension Quick Start

**Get your SJC slot in 5 minutes - no coding required!**

---

## Step 1: Download the Extension

**Option A: Clone with Git (if you have Git installed)**
```bash
git clone https://github.com/khangkhangg/register-a-slot.git
```

**Option B: Download ZIP**
1. Go to https://github.com/khangkhangg/register-a-slot
2. Click green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to a folder

---

## Step 2: Generate Icons (One-Time Setup)

1. Open the file: `browser-extension/icons/icon-generator.html` in your browser
2. You'll see 4 robot icons
3. Click each icon to download:
   - Click the first icon → Save as `icon16.png`
   - Click the second icon → Save as `icon32.png`
   - Click the third icon → Save as `icon48.png`
   - Click the fourth icon → Save as `icon128.png`
4. Save all 4 files in the `browser-extension/icons/` folder

---

## Step 3: Load the Extension

### For Chrome / Edge / Brave:

1. Open your browser
2. Go to extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked"
5. Select the `browser-extension` folder
6. Done! The extension icon should appear in your toolbar

### For Firefox:

1. Open Firefox
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select any file in the `browser-extension` folder
5. Done! (Note: Extension will be removed when you close Firefox)

---

## Step 4: Configure the Extension

1. Click the extension icon in your toolbar
2. Fill in the **"Cấu hình"** (Configuration) tab:

   **Your Information:**
   - **Họ và tên** (Full name): Your full name
   - **Số CCCD** (Citizen ID): Your ID number
   - **Khu vực** (Area): Select your area (default: HCM)
   - **Điểm giao dịch** (Transaction point): Select location (default: HQ)

   **Telegram (Optional but Recommended):**
   - **Bot Token**: Get from @BotFather on Telegram
   - **Chat ID**: Click "Lấy Chat ID" after entering token

   **Settings:**
   - **Chờ trước khi click checkbox**: 7 seconds (recommended)
   - **Thử lại sau khi thất bại**: 5 minutes (recommended)
   - Check "Tự động thử lại" to enable auto-retry

3. Click **"💾 Lưu cấu hình"** (Save Configuration)

---

## Step 5: Setup Telegram Notifications (Optional)

**Why?** Get instant alerts when your slot is registered!

1. **Create Telegram Bot:**
   - Open Telegram
   - Search for `@BotFather`
   - Send `/newbot`
   - Choose a name (e.g., "My SJC Bot")
   - Choose a username (e.g., "my_sjc_slot_bot")
   - Copy the token (looks like: `1234567890:ABCdefGHI...`)

2. **Get Chat ID:**
   - In the extension, paste your bot token
   - Send ANY message to your bot on Telegram
   - Click "Lấy Chat ID" button
   - Your chat ID will auto-fill

3. **Test:**
   - Click "Test Telegram" button
   - You should receive a test message!

4. **Save:**
   - Click "💾 Lưu cấu hình"

---

## Step 6: Run the Bot!

1. Open the SJC registration page:
   ```
   https://tructuyen.sjc.com.vn/dang-nhap
   ```

2. Click the extension icon

3. Click **"▶️ Bắt đầu"** (Start)

4. Watch the magic happen:
   - A colored overlay appears showing progress
   - Bot fills the form automatically
   - You see each step in real-time
   - Get Telegram notification when done

5. To stop: Click **"⏹️ Dừng lại"** (Stop)

---

## 🎉 That's It!

You're all set! The bot will:
- Fill your information automatically
- Use human-like mouse movements
- Wait random delays to avoid detection
- Retry automatically if it fails
- Send you Telegram notifications

---

## 💡 Pro Tips

1. **First Time:** Watch the bot run to see how it works
2. **Stealth:** Use default settings first, increase delays if detected
3. **Notifications:** Always setup Telegram - it's super useful!
4. **Auto-retry:** Enable it so you don't have to manually restart
5. **Advanced:** Check the "Nâng cao" tab for mouse movement customization

---

## ❓ Need Help?

- **Extension won't load?** Make sure you generated all 4 icon files
- **Bot won't start?** Make sure you're on the SJC registration page
- **Telegram not working?** Test with the "Test Telegram" button
- **More help:** Check [browser-extension/README.md](browser-extension/README.md)

---

## 📚 More Information

- **Full Documentation:** [browser-extension/README.md](browser-extension/README.md)
- **Advanced Features:** [FEATURES.md](FEATURES.md)
- **Main README:** [README.md](README.md)
- **Node.js Version:** If you need email notifications or server deployment

---

**Happy slot hunting! 🎯**
