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
  console.log('SJC Slot Bot: Content script loaded');

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
      startBot();
      sendResponse({ status: 'started' });
    } else if (message.action === 'stop') {
      stopBot();
      sendResponse({ status: 'stopped' });
    }
    return true;
  });

  // Start bot
  async function startBot() {
    if (isRunning) {
      console.log('Bot is already running');
      return;
    }

    isRunning = true;
    console.log('Starting bot...');

    // Load configuration
    config = await loadConfig();

    if (!config.fullName || !config.citizenId) {
      showOverlayMessage('Lỗi: Chưa cấu hình đầy đủ thông tin', 'error');
      isRunning = false;
      return;
    }

    // Create overlay
    createOverlay();

    // Run bot
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
        resolve({
          fullName: result.fullName || '',
          citizenId: result.citizenId || '',
          area: result.area || 'Thành phố Hồ Chí Minh',
          transactionPoint: result.transactionPoint || 'TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC',
          telegramToken: result.telegramToken || '',
          telegramChatId: result.telegramChatId || '',
          beforeBotCheckDelay: result.beforeBotCheckDelay || 7,
          retryInterval: result.retryInterval || 5,
          autoRetry: result.autoRetry !== undefined ? result.autoRetry : true,
          mousePattern: result.mousePattern || 'bezier',
          mouseSpeed: result.mouseSpeed || 'medium',
          complexity: result.complexity || 5,
          overshoot: result.overshoot !== undefined ? result.overshoot : true,
          jitter: result.jitter !== undefined ? result.jitter : true,
          randomPauses: result.randomPauses !== undefined ? result.randomPauses : true,
          naturalTyping: result.naturalTyping !== undefined ? result.naturalTyping : true
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
      updateStatus('running', `Đang chạy (lần ${attemptCount})`);
      updateOverlayMessage(`Bắt đầu lần thử #${attemptCount}`);

      // Step 1: Fill name
      updateOverlayMessage('Bước 1: Điền họ tên...');
      await fillInput('input[name="name"], input[placeholder*="Họ và tên"], input[id*="name"]', config.fullName);
      await randomDelay(500, 1000);

      // Step 2: Fill citizen ID
      updateOverlayMessage('Bước 2: Điền số CCCD...');
      await fillInput('input[name="citizenId"], input[name="cccd"], input[placeholder*="Căn cước"]', config.citizenId);
      await randomDelay(500, 1000);

      // Step 3: Select area
      updateOverlayMessage('Bước 3: Chọn khu vực...');
      await selectDropdown('select[name="area"], select[id*="area"]', config.area);
      await randomDelay(800, 1500);

      // Step 4: Select transaction point
      updateOverlayMessage('Bước 4: Chọn điểm giao dịch...');
      await selectDropdown('select[name="point"], select[id*="point"]', config.transactionPoint);
      await randomDelay(800, 1500);

      // Step 5: Wait before bot checkbox
      const waitTime = config.beforeBotCheckDelay * 1000;
      updateOverlayMessage(`Bước 5: Chờ ${config.beforeBotCheckDelay} giây...`);
      await sleep(waitTime);

      // Step 6: Click bot checkbox
      updateOverlayMessage('Bước 6: Click checkbox "Not bot"...');
      await clickCheckbox('input[type="checkbox"]');
      await randomDelay(1000, 2000);

      // Step 7: Submit form
      updateOverlayMessage('Bước 7: Gửi form...');
      await clickButton('button[type="submit"], button:has-text("Đăng ký")');
      await randomDelay(2000, 4000);

      // Step 8: Check result
      updateOverlayMessage('Bước 8: Kiểm tra kết quả...');
      const result = await checkResult();

      if (result.success) {
        successCount++;
        updateOverlayMessage('✅ Đăng ký thành công!');
        updateStatus('success', 'Thành công!');

        // Send Telegram notification
        await sendTelegramNotification(true, 'Đăng ký slot thành công!');

        // Show success message
        setTimeout(() => {
          stopBot();
        }, 5000);

      } else {
        updateOverlayMessage('❌ Thất bại: ' + result.error);
        updateStatus('error', 'Thất bại');

        // Send Telegram notification
        await sendTelegramNotification(false, result.error);

        // Retry if enabled
        if (config.autoRetry && isRunning) {
          const retryTime = config.retryInterval * 60 * 1000;
          updateOverlayMessage(`Thử lại sau ${config.retryInterval} phút...`);

          await sleep(retryTime);

          if (isRunning) {
            // Reload page and retry
            window.location.reload();
          }
        } else {
          stopBot();
        }
      }

    } catch (error) {
      console.error('Bot error:', error);
      updateOverlayMessage('Lỗi: ' + error.message);
      updateStatus('error', 'Lỗi');

      // Send Telegram notification
      await sendTelegramNotification(false, 'Lỗi: ' + error.message);

      // Retry if enabled
      if (config.autoRetry && isRunning) {
        const retryTime = config.retryInterval * 60 * 1000;
        updateOverlayMessage(`Thử lại sau ${config.retryInterval} phút...`);
        await sleep(retryTime);

        if (isRunning) {
          window.location.reload();
        }
      } else {
        stopBot();
      }
    }
  }

  // Fill input with human-like typing
  async function fillInput(selector, value) {
    const input = await waitForElement(selector);

    if (!input) {
      throw new Error(`Element not found: ${selector}`);
    }

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
  }

  // Select dropdown option
  async function selectDropdown(selector, value) {
    const select = await waitForElement(selector);

    if (!select) {
      throw new Error(`Dropdown not found: ${selector}`);
    }

    // Highlight element
    select.classList.add('sjc-bot-highlight');

    // Click to open
    await humanLikeClick(select);
    await randomDelay(300, 700);

    // Set value
    const options = Array.from(select.options);
    const option = options.find(opt => opt.text.includes(value) || opt.value === value);

    if (option) {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      console.warn(`Option not found: ${value}`);
    }

    select.classList.remove('sjc-bot-highlight');
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

  // Click button
  async function clickButton(selector) {
    const button = await waitForElement(selector);

    if (!button) {
      throw new Error(`Button not found: ${selector}`);
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
