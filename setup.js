#!/usr/bin/env node

/**
 * Interactive Setup Script for SJC Slot Registration Bot
 *
 * This script guides users through the complete setup process:
 * - Checks prerequisites
 * - Installs dependencies
 * - Helps create Telegram bot
 * - Configures the bot
 * - Tests configuration
 * - Runs the bot
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import axios from 'axios';

const execAsync = promisify(exec);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisified question function
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Print colored message
 */
function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function printHeader(title) {
  console.log('\n' + '='.repeat(60));
  print(`  ${title}`, 'bright');
  console.log('='.repeat(60) + '\n');
}

/**
 * Print success message
 */
function printSuccess(message) {
  print(`✅ ${message}`, 'green');
}

/**
 * Print error message
 */
function printError(message) {
  print(`❌ ${message}`, 'red');
}

/**
 * Print info message
 */
function printInfo(message) {
  print(`ℹ️  ${message}`, 'cyan');
}

/**
 * Print warning message
 */
function printWarning(message) {
  print(`⚠️  ${message}`, 'yellow');
}

/**
 * Check if Node.js is installed and version is adequate
 */
async function checkNodeVersion() {
  try {
    const { stdout } = await execAsync('node --version');
    const version = stdout.trim();
    const majorVersion = parseInt(version.replace('v', '').split('.')[0]);

    if (majorVersion >= 18) {
      printSuccess(`Node.js ${version} detected`);
      return true;
    } else {
      printError(`Node.js ${version} is too old. Version 18 or higher required.`);
      printInfo('Please install Node.js 18+ from https://nodejs.org/');
      return false;
    }
  } catch (error) {
    printError('Node.js is not installed');
    printInfo('Please install Node.js 18+ from https://nodejs.org/');
    return false;
  }
}

/**
 * Install npm dependencies
 */
async function installDependencies() {
  printHeader('Installing Dependencies');

  printInfo('This may take 1-2 minutes...');

  try {
    await execAsync('npm install', { maxBuffer: 1024 * 1024 * 10 });
    printSuccess('Dependencies installed successfully!');
    return true;
  } catch (error) {
    printError('Failed to install dependencies');
    console.error(error.message);
    return false;
  }
}

/**
 * Guide user through Telegram bot creation
 */
async function guideTelegramBotCreation() {
  printHeader('Telegram Bot Setup');

  print('To receive notifications, you need a Telegram bot.', 'cyan');
  console.log('\nFollow these steps:');
  console.log('1. Open Telegram on your phone or computer');
  console.log('2. Search for "@BotFather"');
  console.log('3. Start a chat and send: /newbot');
  console.log('4. Follow the prompts to create your bot');
  console.log('5. Copy the bot token (looks like: 1234567890:ABCdefGHI...)');

  console.log('\n');
  const hasBot = await question('Have you created your Telegram bot? (yes/no): ');

  if (hasBot.toLowerCase() !== 'yes' && hasBot.toLowerCase() !== 'y') {
    printWarning('Please create a Telegram bot first, then run this setup again.');
    printInfo('Search for @BotFather on Telegram and send /newbot');
    return null;
  }

  const botToken = await question('\nEnter your bot token: ');

  if (!botToken || botToken.length < 30) {
    printError('Invalid bot token. It should be around 45 characters long.');
    return null;
  }

  printSuccess('Bot token received!');
  return botToken.trim();
}

/**
 * Get chat ID from Telegram
 */
async function getChatId(botToken) {
  printHeader('Getting Your Chat ID');

  console.log('To get your chat ID:');
  console.log('1. Open Telegram');
  console.log('2. Search for your bot');
  console.log('3. Send any message to your bot (e.g., "hello")');

  console.log('\n');
  await question('Press Enter after you have sent a message to your bot...');

  printInfo('Fetching your chat ID...');

  try {
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates`);

    if (response.data.ok && response.data.result.length > 0) {
      const updates = response.data.result;
      const chatIds = new Set();

      updates.forEach(update => {
        if (update.message && update.message.chat) {
          chatIds.add(update.message.chat.id);
        }
      });

      if (chatIds.size > 0) {
        const chatId = Array.from(chatIds)[0];
        printSuccess(`Chat ID found: ${chatId}`);

        // Test by sending a message
        try {
          await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: '🎉 Success! Your SJC Slot Registration Bot is configured correctly!'
          });
          printSuccess('Test message sent to your Telegram!');
        } catch (e) {
          printWarning('Chat ID found but could not send test message');
        }

        return chatId.toString();
      }
    }

    printError('No messages found. Make sure you sent a message to your bot.');
    printInfo('Tip: Search for @userinfobot on Telegram, send any message, and it will reply with your chat ID.');

    const manualChatId = await question('\nEnter your chat ID manually (or press Enter to skip): ');
    return manualChatId.trim() || null;

  } catch (error) {
    printError('Failed to fetch chat ID. The bot token may be invalid.');
    return null;
  }
}

/**
 * Get user credentials
 */
async function getUserCredentials() {
  printHeader('Your Registration Information');

  printInfo('This information will be used to fill the registration form.');

  const name = await question('\nEnter your full name: ');
  const citizenId = await question('Enter your Citizen ID (CCCD): ');

  if (!name || !citizenId) {
    printError('Name and Citizen ID are required');
    return null;
  }

  printSuccess('Credentials saved!');
  return { name: name.trim(), citizenId: citizenId.trim() };
}

/**
 * Ask about email notifications
 */
async function askEmailNotifications() {
  printHeader('Email Notifications (Optional)');

  printInfo('You can also receive email notifications in addition to Telegram.');

  const wantEmail = await question('\nDo you want to setup email notifications? (yes/no): ');

  if (wantEmail.toLowerCase() !== 'yes' && wantEmail.toLowerCase() !== 'y') {
    printInfo('Skipping email setup. You can configure it later in config.js');
    return null;
  }

  const emailService = await question('Email service (gmail/outlook/yahoo): ');
  const emailUser = await question('Your email address: ');
  const emailPassword = await question('Your email password (for Gmail, use App Password): ');
  const emailTo = await question('Send notifications to (email): ');

  return {
    enabled: true,
    service: emailService.trim() || 'gmail',
    user: emailUser.trim(),
    password: emailPassword.trim(),
    to: emailTo.trim()
  };
}

/**
 * Create config.js file
 */
function createConfig(credentials, telegram, email) {
  printHeader('Creating Configuration File');

  const configTemplate = `export default {
  // User credentials
  credentials: {
    name: "${credentials.name}",
    citizenId: "${credentials.citizenId}"
  },

  // Form selections
  formData: {
    area: "Thành phố Hồ Chí Minh",
    transactionPoint: "TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC"
  },

  // Timing configurations (in milliseconds)
  timing: {
    // Random wait before clicking "Not bot" checkbox (5-10 seconds)
    beforeBotCheckMin: 5000,
    beforeBotCheckMax: 10000,

    // Retry interval range (1-30 minutes)
    retryIntervalMin: 1 * 60 * 1000,  // 1 minute
    retryIntervalMax: 30 * 60 * 1000, // 30 minutes

    // General page load timeout
    pageLoadTimeout: 60000,

    // Navigation timeout
    navigationTimeout: 30000
  },

  // Telegram configuration
  telegram: {
    enabled: true,
    botToken: "${telegram.botToken}",
    chatId: "${telegram.chatId}"
  },

  // Email configuration (optional)
  email: {
    enabled: ${email ? 'true' : 'false'},${email ? `
    service: "${email.service}",
    user: "${email.user}",
    password: "${email.password}",
    to: "${email.to}",
    cc: "",
    bcc: "",
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "${email.user}",
        pass: "${email.password}"
      }
    },
    template: {
      from: '"SJC Slot Bot" <${email.user}>',
      subjectSuccess: "✅ SJC Slot Registration - SUCCESS",
      subjectFailure: "⚠️ SJC Slot Registration - FAILED",
      includeDetails: true
    }` : `
    service: "gmail",
    user: "your-email@gmail.com",
    password: "your-app-password",
    to: "recipient@email.com",
    cc: "",
    bcc: "",
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password"
      }
    },
    template: {
      from: '"SJC Slot Bot" <your-email@gmail.com>',
      subjectSuccess: "✅ SJC Slot Registration - SUCCESS",
      subjectFailure: "⚠️ SJC Slot Registration - FAILED",
      includeDetails: true
    }`}
  },

  // Mouse movement configuration
  mouseMovement: {
    pattern: 'bezier',
    speed: 'medium',
    complexity: 5,
    overshoot: true,
    overshootProbability: 0.3,
    jitter: true,
    jitterIntensity: 0.5,
    pauseProbability: 0.2,
    pauseDuration: [50, 300],
    bezier: {
      controlPointDeviation: 100,
      useDoubleControlPoints: true
    }
  },

  // Browser configuration
  browser: {
    headless: false,
    slowMo: 50,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled'
    ]
  },

  // Target URL
  url: "https://tructuyen.sjc.com.vn/dang-nhap",

  // Error messages to detect
  errorMessages: {
    sessionExpired: "Phiên làm việc hết hạn hoặc bạn đang sử dụng đồng thời tab khác, trình duyệt khác, vui lòng tải lại trang hoặc chỉ sử dụng 1 tab trình duyệt duy nhất."
  },

  // Maximum retry attempts (0 = infinite)
  maxRetries: 0,

  // Enable verbose logging
  verbose: true
};
`;

  try {
    writeFileSync('config.js', configTemplate, 'utf8');
    printSuccess('Configuration file created: config.js');
    return true;
  } catch (error) {
    printError('Failed to create config.js');
    console.error(error.message);
    return false;
  }
}

/**
 * Test Telegram configuration
 */
async function testTelegram(botToken, chatId) {
  printHeader('Testing Telegram Configuration');

  printInfo('Sending test message...');

  try {
    const message = `
🧪 <b>Setup Test - SJC Slot Bot</b>

✅ Your bot is configured correctly!

The setup is complete and your bot is ready to use.

Run <code>npm start</code> to start the bot.
`;

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    printSuccess('Test message sent! Check your Telegram.');
    return true;
  } catch (error) {
    printError('Failed to send test message');
    console.error(error.message);
    return false;
  }
}

/**
 * Main setup function
 */
async function main() {
  console.clear();

  printHeader('🤖 SJC Slot Registration Bot - Setup');

  print('Welcome! This setup wizard will guide you through the configuration.', 'cyan');
  print('The entire process takes about 3-5 minutes.\n', 'cyan');

  // Check Node.js version
  printInfo('Checking prerequisites...');
  if (!(await checkNodeVersion())) {
    process.exit(1);
  }

  // Install dependencies
  if (!existsSync('node_modules')) {
    if (!(await installDependencies())) {
      process.exit(1);
    }
  } else {
    printSuccess('Dependencies already installed');
  }

  // Telegram bot setup
  const botToken = await guideTelegramBotCreation();
  if (!botToken) {
    process.exit(1);
  }

  const chatId = await getChatId(botToken);
  if (!chatId) {
    printError('Could not get chat ID. Please run setup again.');
    process.exit(1);
  }

  // Get user credentials
  const credentials = await getUserCredentials();
  if (!credentials) {
    process.exit(1);
  }

  // Optional email setup
  const email = await askEmailNotifications();

  // Create config file
  if (!createConfig(credentials, { botToken, chatId }, email)) {
    process.exit(1);
  }

  // Test Telegram
  await testTelegram(botToken, chatId);

  // Final summary
  printHeader('🎉 Setup Complete!');

  printSuccess('Your bot is ready to use!');
  console.log('\n📋 Configuration Summary:');
  console.log(`   Name: ${credentials.name}`);
  console.log(`   Citizen ID: ${credentials.citizenId}`);
  console.log(`   Telegram: ✅ Configured`);
  console.log(`   Email: ${email ? '✅ Configured' : '❌ Not configured'}`);

  console.log('\n📱 Next Steps:');
  console.log('   1. Run: npm start');
  console.log('   2. Watch the bot fill the form automatically');
  console.log('   3. Receive notifications on Telegram');

  console.log('\n📖 Documentation:');
  console.log('   • README.md - Complete guide');
  console.log('   • FEATURES.md - Advanced features');
  console.log('   • config.js - Your configuration (you can edit this)');

  console.log('\n💡 Tips:');
  console.log('   • Press Ctrl+C to stop the bot');
  console.log('   • The bot will retry automatically if it fails');
  console.log('   • Check Telegram for notifications');

  console.log('\n');
  const runNow = await question('Do you want to start the bot now? (yes/no): ');

  if (runNow.toLowerCase() === 'yes' || runNow.toLowerCase() === 'y') {
    rl.close();
    console.log('\n');
    printInfo('Starting bot...\n');

    // Import and run the bot
    try {
      const { default: { spawn } } = await import('child_process');
      const bot = spawn('node', ['index.js'], { stdio: 'inherit' });

      bot.on('exit', (code) => {
        if (code !== 0) {
          printError(`Bot exited with code ${code}`);
        }
        process.exit(code);
      });
    } catch (error) {
      printError('Failed to start bot');
      console.error(error.message);
      printInfo('You can start it manually with: npm start');
      process.exit(1);
    }
  } else {
    rl.close();
    console.log('\n');
    printInfo('Setup complete! Run "npm start" when you\'re ready.');
    print('\nGood luck with your slot registration! 🚀\n', 'green');
    process.exit(0);
  }
}

// Run setup
main().catch((error) => {
  printError('Setup failed');
  console.error(error);
  process.exit(1);
});
