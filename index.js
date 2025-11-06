import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import config from './config.js';
import {
  randomBetween,
  sleep,
  humanLikeClick,
  humanLikeType,
  sendTelegramNotification,
  log,
  waitForElement,
  selectDropdownByText
} from './utils.js';

// Add stealth plugin to evade bot detection
puppeteer.use(StealthPlugin());

class SlotRegistrationBot {
  constructor() {
    this.browser = null;
    this.page = null;
    this.attemptCount = 0;
    this.successCount = 0;
  }

  /**
   * Initialize browser and page
   */
  async initialize() {
    try {
      log('Initializing browser with stealth mode...');

      this.browser = await puppeteer.launch({
        headless: config.browser.headless,
        slowMo: config.browser.slowMo,
        args: config.browser.args,
        defaultViewport: null
      });

      this.page = await this.browser.newPage();

      // Additional anti-detection measures
      await this.page.evaluateOnNewDocument(() => {
        // Override the navigator.webdriver property
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false
        });

        // Mock plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5]
        });

        // Mock languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['vi-VN', 'vi', 'en-US', 'en']
        });

        // Override chrome property
        window.chrome = {
          runtime: {}
        };

        // Override permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
          parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters)
        );
      });

      // Set realistic viewport
      await this.page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
      });

      // Set user agent
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Enable request interception for additional stealth
      await this.page.setRequestInterception(true);
      this.page.on('request', (request) => {
        // Block unnecessary resources to speed up loading
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });

      log('Browser initialized successfully', 'SUCCESS');
      return true;
    } catch (error) {
      log(`Failed to initialize browser: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  /**
   * Navigate to the registration page
   */
  async navigateToPage() {
    try {
      log(`Navigating to ${config.url}...`);

      await this.page.goto(config.url, {
        waitUntil: 'networkidle2',
        timeout: config.timing.navigationTimeout
      });

      // Random delay to appear more human
      await sleep(randomBetween(1000, 2000));

      log('Page loaded successfully', 'SUCCESS');
      return true;
    } catch (error) {
      log(`Failed to navigate to page: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  /**
   * Fill in login/registration form
   */
  async fillLoginForm() {
    try {
      log('Filling in login form...');

      // Wait for name input field
      const nameSelector = 'input[name="name"], input[placeholder*="Họ và tên"], input[id*="name"]';
      await waitForElement(this.page, nameSelector, { timeout: 10000 });

      const nameInput = await this.page.$(nameSelector);
      if (nameInput) {
        await humanLikeType(this.page, nameInput, config.credentials.name);
        log('Name entered', 'SUCCESS');
      }

      await sleep(randomBetween(500, 1000));

      // Wait for citizen ID input field
      const idSelector = 'input[name="citizenId"], input[name="cccd"], input[placeholder*="Căn cước"], input[id*="citizen"]';
      await waitForElement(this.page, idSelector, { timeout: 10000 });

      const idInput = await this.page.$(idSelector);
      if (idInput) {
        await humanLikeType(this.page, idInput, config.credentials.citizenId);
        log('Citizen ID entered', 'SUCCESS');
      }

      await sleep(randomBetween(500, 1000));

      log('Login form filled successfully', 'SUCCESS');
      return true;
    } catch (error) {
      log(`Failed to fill login form: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  /**
   * Select area and transaction point from dropdowns
   */
  async selectFormOptions() {
    try {
      log('Selecting form options...');

      // Select area (Khu vực)
      const areaSelector = 'select[name="area"], select[id*="area"], select[name="khu-vuc"]';
      await waitForElement(this.page, areaSelector, { timeout: 10000 });

      await selectDropdownByText(this.page, areaSelector, config.formData.area);
      log(`Area selected: ${config.formData.area}`, 'SUCCESS');

      await sleep(randomBetween(1000, 2000));

      // Select transaction point (Điểm giao dịch)
      const pointSelector = 'select[name="point"], select[name="transaction-point"], select[id*="point"]';
      await waitForElement(this.page, pointSelector, { timeout: 10000 });

      await selectDropdownByText(this.page, pointSelector, config.formData.transactionPoint);
      log(`Transaction point selected: ${config.formData.transactionPoint}`, 'SUCCESS');

      await sleep(randomBetween(500, 1000));

      log('Form options selected successfully', 'SUCCESS');
      return true;
    } catch (error) {
      log(`Failed to select form options: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  /**
   * Handle "Not a bot" checkbox with human-like behavior
   */
  async handleBotCheckbox() {
    try {
      log('Handling bot detection checkbox...');

      // Random wait before interacting with checkbox (5-10 seconds)
      const waitTime = randomBetween(
        config.timing.beforeBotCheckMin,
        config.timing.beforeBotCheckMax
      );
      log(`Waiting ${Math.round(waitTime / 1000)} seconds before checkbox...`);
      await sleep(waitTime);

      // Find checkbox - try multiple selectors
      const checkboxSelectors = [
        'input[type="checkbox"]',
        '.recaptcha-checkbox',
        '[role="checkbox"]',
        'input[name*="bot"]',
        'input[id*="bot"]'
      ];

      let checkbox = null;
      for (const selector of checkboxSelectors) {
        checkbox = await this.page.$(selector);
        if (checkbox) {
          log(`Found checkbox with selector: ${selector}`);
          break;
        }
      }

      if (!checkbox) {
        throw new Error('Bot checkbox not found');
      }

      // Move mouse to checkbox in human-like way
      await humanLikeClick(this.page, checkbox);

      log('Bot checkbox clicked successfully', 'SUCCESS');

      // Wait a bit after clicking
      await sleep(randomBetween(1000, 2000));

      return true;
    } catch (error) {
      log(`Failed to handle bot checkbox: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  /**
   * Submit the registration form
   */
  async submitForm() {
    try {
      log('Submitting registration form...');

      // Find submit button - try multiple selectors
      const submitSelectors = [
        'button[type="submit"]',
        'button:has-text("Đăng ký")',
        'input[type="submit"]',
        'button.submit',
        '[id*="submit"]'
      ];

      let submitButton = null;
      for (const selector of submitSelectors) {
        try {
          submitButton = await this.page.$(selector);
          if (submitButton) {
            const isVisible = await submitButton.isIntersectingViewport();
            if (isVisible) {
              log(`Found submit button with selector: ${selector}`);
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }

      if (!submitButton) {
        throw new Error('Submit button not found');
      }

      // Click submit button with human-like behavior
      await humanLikeClick(this.page, submitButton);

      log('Form submitted successfully', 'SUCCESS');

      // Wait for response
      await sleep(randomBetween(2000, 4000));

      return true;
    } catch (error) {
      log(`Failed to submit form: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  /**
   * Check for error modal
   */
  async checkForErrors() {
    try {
      // Wait a bit for modal to appear
      await sleep(1000);

      // Check for error modal
      const modalSelector = '.swal2-html-container';
      const modal = await this.page.$(modalSelector);

      if (modal) {
        const errorText = await this.page.evaluate(el => el.textContent, modal);

        if (errorText.includes(config.errorMessages.sessionExpired)) {
          log('Session expired error detected', 'WARNING');
          return { hasError: true, errorType: 'session_expired', message: errorText };
        }

        return { hasError: true, errorType: 'unknown', message: errorText };
      }

      // Check for success indicators
      const successSelectors = [
        '.success',
        '.swal2-success',
        '[class*="success"]'
      ];

      for (const selector of successSelectors) {
        const successElement = await this.page.$(selector);
        if (successElement) {
          return { hasError: false, success: true };
        }
      }

      return { hasError: false };
    } catch (error) {
      log(`Error checking for errors: ${error.message}`, 'WARNING');
      return { hasError: false };
    }
  }

  /**
   * Send notification about registration status
   */
  async sendNotification(success, message = '') {
    try {
      if (!config.telegram.enabled || !config.telegram.chatId) {
        log('Telegram notifications not configured', 'WARNING');
        return;
      }

      const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

      let notificationMessage;
      if (success) {
        notificationMessage = `
🎉 <b>SJC Slot Registration - SUCCESS</b>

✅ Successfully registered slot!

<b>Details:</b>
👤 Name: ${config.credentials.name}
🆔 Citizen ID: ${config.credentials.citizenId}
📍 Area: ${config.formData.area}
🏢 Point: ${config.formData.transactionPoint}

⏰ Time: ${timestamp}
🔄 Attempt: #${this.attemptCount}
`;
      } else {
        notificationMessage = `
⚠️ <b>SJC Slot Registration - FAILED</b>

❌ Registration attempt failed

<b>Error:</b>
${message || 'Unknown error'}

<b>Details:</b>
👤 Name: ${config.credentials.name}
⏰ Time: ${timestamp}
🔄 Attempt: #${this.attemptCount}

🔄 Will retry shortly...
`;
      }

      await sendTelegramNotification(
        config.telegram.botToken,
        config.telegram.chatId,
        notificationMessage
      );

      log('Notification sent', 'SUCCESS');
    } catch (error) {
      log(`Failed to send notification: ${error.message}`, 'ERROR');
    }
  }

  /**
   * Perform one registration attempt
   */
  async performRegistrationAttempt() {
    try {
      this.attemptCount++;
      log(`\n${'='.repeat(60)}`);
      log(`Starting registration attempt #${this.attemptCount}...`);
      log('='.repeat(60));

      // Navigate to page
      await this.navigateToPage();

      // Fill login form
      await this.fillLoginForm();

      // Select form options
      await this.selectFormOptions();

      // Handle bot checkbox
      await this.handleBotCheckbox();

      // Submit form
      await this.submitForm();

      // Check for errors
      const result = await this.checkForErrors();

      if (result.hasError) {
        log(`Registration failed: ${result.message}`, 'ERROR');
        await this.sendNotification(false, result.message);
        return { success: false, error: result };
      }

      // Success!
      this.successCount++;
      log('Registration completed successfully!', 'SUCCESS');
      await this.sendNotification(true);

      return { success: true };

    } catch (error) {
      log(`Registration attempt failed: ${error.message}`, 'ERROR');
      await this.sendNotification(false, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Main execution loop with retry logic
   */
  async run() {
    try {
      // Initialize browser
      await this.initialize();

      // Send startup notification
      if (config.telegram.enabled && config.telegram.chatId) {
        await sendTelegramNotification(
          config.telegram.botToken,
          config.telegram.chatId,
          `🤖 <b>SJC Slot Registration Bot Started</b>\n\n` +
          `✅ Bot is now running and will attempt to register slots automatically.\n` +
          `📱 You will receive notifications for each attempt.`
        );
      }

      let retryCount = 0;

      while (true) {
        // Perform registration attempt
        const result = await this.performRegistrationAttempt();

        if (result.success) {
          log('\n🎉 Registration successful! Bot will now stop.', 'SUCCESS');
          break;
        }

        // Check if we've reached max retries
        if (config.maxRetries > 0 && retryCount >= config.maxRetries) {
          log(`Maximum retry attempts (${config.maxRetries}) reached. Stopping.`, 'WARNING');
          break;
        }

        retryCount++;

        // Calculate random retry interval
        const retryInterval = randomBetween(
          config.timing.retryIntervalMin,
          config.timing.retryIntervalMax
        );

        const minutes = Math.round(retryInterval / 60000);
        log(`\nWaiting ${minutes} minute(s) before next attempt...`, 'INFO');
        log(`Next attempt will be at: ${new Date(Date.now() + retryInterval).toLocaleTimeString('vi-VN')}`);

        await sleep(retryInterval);

        // Reload page for fresh session
        try {
          await this.page.reload({ waitUntil: 'networkidle2' });
        } catch (error) {
          log('Page reload failed, will try to navigate fresh', 'WARNING');
        }
      }

    } catch (error) {
      log(`Critical error: ${error.message}`, 'ERROR');
      throw error;
    } finally {
      // Cleanup
      await this.cleanup();
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    try {
      log('Cleaning up resources...');

      if (this.page) {
        await this.page.close();
      }

      if (this.browser) {
        await this.browser.close();
      }

      log(`\nBot stopped. Total attempts: ${this.attemptCount}, Successes: ${this.successCount}`, 'INFO');
    } catch (error) {
      log(`Error during cleanup: ${error.message}`, 'ERROR');
    }
  }
}

// Main execution
(async () => {
  const bot = new SlotRegistrationBot();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    log('\n\nReceived SIGINT signal. Shutting down gracefully...', 'WARNING');
    await bot.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    log('\n\nReceived SIGTERM signal. Shutting down gracefully...', 'WARNING');
    await bot.cleanup();
    process.exit(0);
  });

  try {
    await bot.run();
  } catch (error) {
    log(`\nBot crashed: ${error.message}`, 'ERROR');
    console.error(error);
    process.exit(1);
  }
})();
