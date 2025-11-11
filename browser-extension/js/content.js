// Content script for SJC Slot Registration Bot
// Runs on https://tructuyen.sjc.com.vn/*

(async function() {
  'use strict';

  let isRunning = false;
  let overlay = null;
  let config = null;
  let attemptCount = 0;
  let successCount = 0;

  // Initialize
  console.log('🤖 SJC Slot Bot: Content script loaded and ready');
  console.log('📍 Current URL:', window.location.href);

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Received message from popup:', message);

    if (message.action === 'start') {
      console.log('▶️ START command received, initiating bot...');
      startBot();
      sendResponse({ status: 'started' });
    } else if (message.action === 'stop') {
      console.log('⏹️ STOP command received, stopping bot...');
      stopBot();
      sendResponse({ status: 'stopped' });
    } else {
      console.log('❓ Unknown action:', message.action);
      sendResponse({ status: 'unknown' });
    }
    return true;
  });

  // Start bot
  async function startBot() {
    if (isRunning) {
      console.log('⚠️ Bot is already running, ignoring start request');
      return;
    }

    isRunning = true;
    console.log('✅ Starting bot...');

    // Load configuration
    console.log('📋 Loading configuration from storage...');
    config = await loadConfig();
    console.log('📋 Configuration loaded:', {
      fullName: config.fullName,
      citizenId: config.citizenId ? '***' + config.citizenId.slice(-4) : 'not set',
      area: config.area,
      transactionPoint: config.transactionPoint
    });

    if (!config.fullName || !config.citizenId) {
      console.error('❌ Configuration incomplete!');
      showOverlayMessage('Lỗi: Chưa cấu hình đầy đủ thông tin', 'error');
      isRunning = false;
      return;
    }

    // Create overlay
    console.log('🎨 Creating overlay...');
    createOverlay();

    // Run bot
    console.log('🚀 Running bot automation...');
    await runBot();
  }

  // Stop bot
  function stopBot() {
    isRunning = false;
    console.log('Stopping bot...');

    if (overlay) {
      overlay.remove();
      overlay = null;
    }

    updateStatus('inactive', 'Đã dừng');
  }

  // Load configuration from storage
  async function loadConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get([
        'fullName',
        'citizenId',
        'area',
        'transactionPoint',
        'telegramToken',
        'telegramChatId',
        'beforeBotCheckDelay',
        'retryInterval',
        'autoRetry',
        'mousePattern',
        'mouseSpeed',
        'complexity',
        'overshoot',
        'jitter',
        'randomPauses',
        'naturalTyping'
      ], (result) => {
        // Firefox fix: ensure result is an object
        const config = result || {};

        resolve({
          fullName: config.fullName || '',
          citizenId: config.citizenId || '',
          area: config.area || 'Thành phố Hồ Chí Minh',
          transactionPoint: config.transactionPoint || 'TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC',
          telegramToken: config.telegramToken || '',
          telegramChatId: config.telegramChatId || '',
          beforeBotCheckDelay: config.beforeBotCheckDelay || 7,
          retryInterval: config.retryInterval || 5,
          autoRetry: config.autoRetry !== undefined ? config.autoRetry : true,
          mousePattern: config.mousePattern || 'bezier',
          mouseSpeed: config.mouseSpeed || 'medium',
          complexity: config.complexity || 5,
          overshoot: config.overshoot !== undefined ? config.overshoot : true,
          jitter: config.jitter !== undefined ? config.jitter : true,
          randomPauses: config.randomPauses !== undefined ? config.randomPauses : true,
          naturalTyping: config.naturalTyping !== undefined ? config.naturalTyping : true
        });
      });
    });
  }

  // Create overlay
  function createOverlay() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'sjc-bot-overlay';
    overlay.innerHTML = `
      <div class="sjc-bot-overlay-header">
        <div class="sjc-bot-overlay-title">🤖 SJC Slot Bot</div>
        <button class="sjc-bot-overlay-close">×</button>
      </div>
      <div class="sjc-bot-overlay-status">
        <div class="sjc-bot-status-indicator"></div>
        <span id="overlay-status-text">Đang khởi động...</span>
      </div>
      <div class="sjc-bot-overlay-progress" id="overlay-progress">
        Đang chuẩn bị...
      </div>
      <div class="sjc-bot-overlay-actions">
        <button class="sjc-bot-overlay-btn danger" id="overlay-stop-btn">Dừng lại</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close button
    overlay.querySelector('.sjc-bot-overlay-close').addEventListener('click', stopBot);

    // Stop button
    overlay.querySelector('#overlay-stop-btn').addEventListener('click', stopBot);
  }

  // Update overlay message
  function updateOverlayMessage(message) {
    if (overlay) {
      const progressEl = overlay.querySelector('#overlay-progress');
      if (progressEl) {
        progressEl.textContent = message;
      }
    }
  }

  // Show overlay message
  function showOverlayMessage(message, type = 'info') {
    updateOverlayMessage(message);
    console.log(`[${type}] ${message}`);
  }

  // Run bot main logic
  async function runBot() {
    try {
      attemptCount++;
      console.log(`\n🎯 Starting attempt #${attemptCount}`);
      updateStatus('running', `Đang chạy (lần ${attemptCount})`);
      updateOverlayMessage(`Bắt đầu lần thử #${attemptCount}`);

      // Step 1: Fill name
      console.log('📝 Step 1: Filling name field...');
      updateOverlayMessage('Bước 1: Điền họ tên...');
      await fillInput('input[name="name"], input[placeholder*="Họ và tên"], input[id*="name"]', config.fullName);
      console.log('✓ Name filled successfully');
      await randomDelay(500, 1000);

      // Step 2: Fill citizen ID
      console.log('📝 Step 2: Filling citizen ID field...');
      updateOverlayMessage('Bước 2: Điền số CCCD...');
      await fillInput('input[name="citizenId"], input[name="cccd"], input[placeholder*="Căn cước"], input[placeholder*="cước"]', config.citizenId);
      console.log('✓ Citizen ID filled successfully');
      await randomDelay(500, 1000);

      // Step 3: Click Login button
      console.log('🔑 Step 3: Clicking Login button...');
      updateOverlayMessage('Bước 3: Đăng nhập...');
      await clickButton('button[type="submit"], input[type="submit"], button.login, button#login, .btn-login');
      console.log('✓ Login button clicked');

      // Wait for login to process and page to load
      console.log('⏳ Waiting for login to process...');
      updateOverlayMessage('Đang xử lý đăng nhập...');
      await randomDelay(2000, 3000);
      console.log('✓ Login processed');

      // Step 4: Select area
      console.log('📝 Step 4: Selecting area (Khu vực)...');
      updateOverlayMessage('Bước 4: Chọn khu vực...');
      await selectDropdown('#id_area, select[name="Area"]', config.area);
      console.log('✓ Area selected successfully');

      // Wait for store dropdown to populate
      console.log('⏳ Waiting for transaction points to load...');
      await randomDelay(1000, 2000);

      // Step 5: Select transaction point
      console.log('📝 Step 5: Selecting transaction point (Điểm giao dịch)...');
      updateOverlayMessage('Bước 5: Chọn điểm giao dịch...');
      await selectDropdown('#id_store, select[name="store"]', config.transactionPoint);
      console.log('✓ Transaction point selected successfully');
      await randomDelay(800, 1500);

      // Step 6: Wait before bot checkbox
      const waitTime = config.beforeBotCheckDelay * 1000;
      console.log(`⏳ Step 6: Waiting ${config.beforeBotCheckDelay} seconds before reCAPTCHA...`);
      updateOverlayMessage(`Bước 6: Chờ ${config.beforeBotCheckDelay} giây...`);
      await sleep(waitTime);
      console.log('✓ Wait complete');

      // Step 7: Click reCAPTCHA checkbox
      console.log('📝 Step 7: Clicking reCAPTCHA checkbox...');
      updateOverlayMessage('Bước 7: Click "I\'m not a robot"...');
      await clickRecaptcha();
      console.log('✓ reCAPTCHA clicked successfully');
      await randomDelay(2000, 3000);

      // Step 8: Submit form
      console.log('📝 Step 8: Submitting registration form...');
      updateOverlayMessage('Bước 8: Gửi form đăng ký...');
      await clickButton('#register_form_submit, button[type="submit"]');
      console.log('✓ Form submitted');
      await randomDelay(2000, 4000);

      // Step 9: Check result
      console.log('🔍 Step 9: Checking result...');
      updateOverlayMessage('Bước 9: Kiểm tra kết quả...');
      const result = await checkResult();
      console.log('Result:', result);

      if (result.success) {
        successCount++;
        updateOverlayMessage('✅ Đăng ký thành công!');
        updateStatus('success', 'Thành công!');
        console.log('🎉 SUCCESS! Registration completed successfully!');

        // Send Telegram notification
        await sendTelegramNotification(true, 'Đăng ký slot thành công!');

        // Show success message
        setTimeout(() => {
          stopBot();
        }, 5000);

      } else {
        console.error('❌ Registration failed:', result.error);
        updateOverlayMessage('❌ Thất bại: ' + result.error);
        updateStatus('error', 'Thất bại');

        // Send Telegram notification
        await sendTelegramNotification(false, result.error);

        // Always retry (1 attempt per day)
        if (isRunning) {
          const retryHours = 24; // 1 day
          const retryTime = retryHours * 60 * 60 * 1000; // 24 hours in milliseconds
          const nextAttemptTime = new Date(Date.now() + retryTime);

          console.log(`⏰ Will retry in ${retryHours} hours (${nextAttemptTime.toLocaleString()})`);
          updateOverlayMessage(`Thử lại vào ${nextAttemptTime.toLocaleTimeString()} ngày ${nextAttemptTime.toLocaleDateString()}`);

          await sleep(retryTime);

          if (isRunning) {
            console.log('🔄 Retrying now...');
            // Reload page and retry
            window.location.reload();
          }
        } else {
          stopBot();
        }
      }

    } catch (error) {
      console.error('💥 BOT ERROR - Critical failure:');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error details:', error);

      updateOverlayMessage('❌ Lỗi: ' + error.message);
      updateStatus('error', 'Lỗi: ' + error.message);

      // Send detailed Telegram notification
      const errorDetails = `Lỗi: ${error.message}\n\nStack: ${error.stack}`;
      await sendTelegramNotification(false, errorDetails);

      // Always retry (1 attempt per day)
      if (isRunning) {
        const retryHours = 24; // 1 day
        const retryTime = retryHours * 60 * 60 * 1000;
        const nextAttemptTime = new Date(Date.now() + retryTime);

        console.log(`⏰ Error occurred, will retry in ${retryHours} hours (${nextAttemptTime.toLocaleString()})`);
        updateOverlayMessage(`Lỗi xảy ra. Thử lại vào ${nextAttemptTime.toLocaleTimeString()} ngày ${nextAttemptTime.toLocaleDateString()}`);

        await sleep(retryTime);

        if (isRunning) {
          console.log('🔄 Retrying after error...');
          window.location.reload();
        }
      } else {
        stopBot();
      }
    }
  }

  // Fill input with human-like typing
  async function fillInput(selector, value) {
    try {
      console.log(`📝 Attempting to find input: ${selector}`);
      const input = await waitForElement(selector);

      if (!input) {
        throw new Error(`Element not found: ${selector}`);
      }

      console.log(`✓ Input found, filling with value: ${value.substring(0, 3)}...`);

      // Highlight element
      input.classList.add('sjc-bot-highlight');

      // Click to focus
      await humanLikeClick(input);
      await randomDelay(200, 500);

      // Clear existing value
      input.value = '';

      // Type with delays
      if (config.naturalTyping) {
        for (let char of value) {
          input.value += char;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          await randomDelay(80, 150);
        }
      } else {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }

      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.classList.remove('sjc-bot-highlight');

      console.log(`✓ Input filled successfully`);
    } catch (error) {
      console.error(`❌ Error filling input ${selector}:`, error.message);
      console.error('Stack trace:', error.stack);
      throw error; // Re-throw to be caught by runBot()
    }
  }

  // Select dropdown option (supports regular and Select2 dropdowns)
  async function selectDropdown(selector, value) {
    try {
      console.log(`📋 Attempting to select dropdown: ${selector}`);

      // Try multiple selectors
      const selectors = selector.split(',').map(s => s.trim());
      let select = null;

      for (const sel of selectors) {
        select = await waitForElement(sel, 3000);
        if (select) {
          console.log(`✓ Found dropdown with selector: ${sel}`);
          break;
        }
      }

      if (!select) {
        throw new Error(`Dropdown not found with any selector: ${selector}`);
      }

      console.log(`Dropdown found, selecting option: "${value}"`);

      // Highlight element
      select.classList.add('sjc-bot-highlight');

      // Find matching option
      const options = Array.from(select.options);
      console.log(`Available options (${options.length}):`, options.map(opt => ({ value: opt.value, text: opt.text })));

      const option = options.find(opt =>
        opt.text.includes(value) ||
        opt.value === value ||
        opt.text.trim() === value.trim()
      );

      if (option) {
        console.log(`✓ Found matching option:`, { value: option.value, text: option.text });

        // Set value
        select.value = option.value;

        // Trigger change events (for both regular selects and Select2)
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('select2:select', { bubbles: true }));

        // If jQuery and Select2 are available, use them
        if (typeof jQuery !== 'undefined' && jQuery(select).data('select2')) {
          console.log('Using jQuery Select2 API...');
          jQuery(select).val(option.value).trigger('change');
        }

        console.log(`✓ Dropdown value set to: ${option.value}`);
      } else {
        console.error(`❌ Option not found for value: "${value}"`);
        console.error(`Available options:`, options.map(opt => opt.text));
        throw new Error(`Option not found in dropdown: "${value}". Available: ${options.map(o => o.text).join(', ')}`);
      }

      await randomDelay(500, 1000);
      select.classList.remove('sjc-bot-highlight');
    } catch (error) {
      console.error(`❌ Error selecting dropdown ${selector}:`, error.message);
      console.error('Stack trace:', error.stack);
      throw error; // Re-throw to be caught by runBot()
    }
  }

  // Click reCAPTCHA checkbox (inside iframe)
  async function clickRecaptcha() {
    console.log('Looking for reCAPTCHA...');

    // Wait for reCAPTCHA container
    const recaptchaContainer = await waitForElement('#g-recaptcha, .g-recaptcha', 5000);
    if (!recaptchaContainer) {
      throw new Error('reCAPTCHA container not found');
    }

    console.log('reCAPTCHA container found, looking for iframe...');

    // Wait a bit for iframe to load
    await randomDelay(1000, 2000);

    // Find the reCAPTCHA iframe
    const iframes = document.querySelectorAll('iframe[src*="recaptcha"], iframe[title*="reCAPTCHA"]');
    console.log(`Found ${iframes.length} reCAPTCHA iframes`);

    let checkbox = null;

    for (const iframe of iframes) {
      try {
        console.log('Checking iframe:', iframe.src);
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Look for the checkbox inside the iframe
        checkbox = iframeDoc.querySelector('.recaptcha-checkbox-border, #recaptcha-anchor');

        if (checkbox) {
          console.log('✓ Found reCAPTCHA checkbox inside iframe!');

          // Move mouse to iframe area
          const rect = iframe.getBoundingClientRect();
          console.log('reCAPTCHA iframe position:', rect);

          // Click the checkbox
          await randomDelay(500, 1000);
          checkbox.click();
          console.log('✓ reCAPTCHA checkbox clicked');
          break;
        }
      } catch (error) {
        console.log('Could not access iframe (probably cross-origin):', error.message);
      }
    }

    if (!checkbox) {
      // Fallback: Try to click the iframe itself
      console.log('Could not access checkbox inside iframe, trying to click iframe...');
      const mainIframe = iframes[0];
      if (mainIframe) {
        await humanLikeClick(mainIframe);
        console.log('✓ Clicked reCAPTCHA iframe');
      } else {
        throw new Error('Could not find or click reCAPTCHA');
      }
    }

    // Wait for reCAPTCHA to process
    await randomDelay(1000, 2000);
  }

  // Click checkbox
  async function clickCheckbox(selector) {
    const checkbox = await waitForElement(selector);

    if (!checkbox) {
      throw new Error(`Checkbox not found: ${selector}`);
    }

    checkbox.classList.add('sjc-bot-highlight');

    // Move mouse to checkbox
    await moveMouseToElement(checkbox);
    await randomDelay(200, 500);

    // Click
    await humanLikeClick(checkbox);

    checkbox.classList.remove('sjc-bot-highlight');
  }

  // Click button (supports multiple selectors or text search)
  async function clickButton(selectorOrText) {
    let button = null;

    // If it's a comma-separated list of selectors, try each one
    const selectors = selectorOrText.split(',').map(s => s.trim());

    for (const selector of selectors) {
      // Try as CSS selector first
      button = await waitForElement(selector, 2000);
      if (button) {
        console.log(`Found button with selector: ${selector}`);
        break;
      }
    }

    // If not found, try finding by text content
    if (!button) {
      console.log('Button not found by selector, searching by text...');
      const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a.btn, a.button');
      const searchTexts = ['Đăng nhập', 'Login', 'Đăng ký', 'Submit', 'Gửi'];

      for (const btn of buttons) {
        const text = btn.textContent || btn.value || '';
        for (const searchText of searchTexts) {
          if (text.includes(searchText)) {
            button = btn;
            console.log(`Found button by text: "${text}"`);
            break;
          }
        }
        if (button) break;
      }
    }

    if (!button) {
      throw new Error(`Button not found: ${selectorOrText}`);
    }

    button.classList.add('sjc-bot-highlight');

    await moveMouseToElement(button);
    await randomDelay(200, 500);

    await humanLikeClick(button);

    button.classList.remove('sjc-bot-highlight');
  }

  // Human-like click
  async function humanLikeClick(element) {
    // Create click event
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.3;
    const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.3;

    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    });

    element.dispatchEvent(clickEvent);
  }

  // Move mouse to element (visual effect)
  async function moveMouseToElement(element) {
    if (!config.jitter) return;

    const rect = element.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    // Create cursor trail
    const trail = document.createElement('div');
    trail.className = 'sjc-bot-cursor-trail';
    trail.style.left = targetX + 'px';
    trail.style.top = targetY + 'px';
    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 500);
  }

  // Wait for element
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Timeout
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  // Check result
  async function checkResult() {
    await sleep(2000);

    // Check for error modal
    const errorModal = document.querySelector('.swal2-html-container');
    if (errorModal) {
      const errorText = errorModal.textContent;
      return {
        success: false,
        error: errorText
      };
    }

    // Check for success indicators
    const successIndicators = document.querySelectorAll('.success, .swal2-success, [class*="success"]');
    if (successIndicators.length > 0) {
      return {
        success: true
      };
    }

    // Default: assume success if no error
    return {
      success: true
    };
  }

  // Send Telegram notification
  async function sendTelegramNotification(success, message) {
    if (!config.telegramToken || !config.telegramChatId) {
      return;
    }

    try {
      const text = success
        ? `🎉 *SJC Slot Registration - SUCCESS*\n\n✅ ${message}\n\n👤 ${config.fullName}\n🆔 ${config.citizenId}\n📍 ${config.area}\n🔄 Lần thử: ${attemptCount}`
        : `⚠️ *SJC Slot Registration - FAILED*\n\n❌ ${message}\n\n👤 ${config.fullName}\n🔄 Lần thử: ${attemptCount}`;

      await fetch(`https://api.telegram.org/bot${config.telegramToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: config.telegramChatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
    }
  }

  // Update status
  function updateStatus(state, text) {
    // Save to storage
    chrome.storage.local.set({
      botStatus: { state, text },
      attemptCount,
      successCount
    });

    // Send message to popup
    chrome.runtime.sendMessage({
      action: 'statusUpdate',
      state,
      text,
      attemptCount,
      successCount
    });
  }

  // Helper: Sleep
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper: Random delay
  function randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return sleep(delay);
  }

})();
