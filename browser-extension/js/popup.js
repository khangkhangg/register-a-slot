// Popup script for SJC Slot Registration Bot

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Load saved configuration
  await loadConfig();

  // Setup event listeners
  setupEventListeners();

  // Setup range sliders
  setupRangeSliders();

  // Check bot status
  await updateStatus();
}

// Setup all event listeners
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Form submission
  document.getElementById('configForm').addEventListener('submit', saveConfig);

  // Advanced settings
  document.getElementById('saveAdvancedBtn').addEventListener('click', saveAdvancedSettings);

  // Telegram buttons
  document.getElementById('getChatIdBtn').addEventListener('click', getChatId);
  document.getElementById('testTelegramBtn').addEventListener('click', testTelegram);

  // Action buttons
  document.getElementById('startBtn').addEventListener('click', startBot);
  document.getElementById('stopBtn').addEventListener('click', stopBot);
}

// Setup range slider displays
function setupRangeSliders() {
  const sliders = [
    { id: 'beforeBotCheckDelay', valueId: 'beforeBotCheckDelayValue' },
    { id: 'retryInterval', valueId: 'retryIntervalValue' },
    { id: 'complexity', valueId: 'complexityValue' }
  ];

  sliders.forEach(({ id, valueId }) => {
    const slider = document.getElementById(id);
    const value = document.getElementById(valueId);

    slider.addEventListener('input', (e) => {
      value.textContent = e.target.value;
    });
  });
}

// Switch tabs
function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Update content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Load configuration from storage
async function loadConfig() {
  try {
    // Use callback pattern for Firefox compatibility
    const result = await new Promise((resolve) => {
      chrome.storage.local.get([
        'fullName',
        'citizenId',
        'area',
        'transactionPoint',
        'telegramToken',
        'telegramChatId',
        'beforeBotCheckDelay',
        'retryInterval',
        'nextRegistrationTime',
        'autoRetry',
        'mousePattern',
        'mouseSpeed',
        'complexity',
        'overshoot',
        'jitter',
        'randomPauses',
        'naturalTyping'
      ], (items) => {
        resolve(items || {}); // Firefox fix: ensure result is an object
      });
    });

    console.log('Loaded configuration:', result);

    // Populate form fields (with null/undefined checks for Firefox)
    if (result && result.fullName) document.getElementById('fullName').value = result.fullName;
    if (result && result.citizenId) document.getElementById('citizenId').value = result.citizenId;
    if (result && result.area) document.getElementById('area').value = result.area;
    if (result && result.transactionPoint) document.getElementById('transactionPoint').value = result.transactionPoint;
    if (result && result.telegramToken) document.getElementById('telegramToken').value = result.telegramToken;
    if (result && result.telegramChatId) document.getElementById('telegramChatId').value = result.telegramChatId;
    if (result && result.beforeBotCheckDelay) document.getElementById('beforeBotCheckDelay').value = result.beforeBotCheckDelay;
    if (result && result.retryInterval) document.getElementById('retryInterval').value = result.retryInterval;
    if (result && result.nextRegistrationTime) document.getElementById('nextRegistrationTime').value = result.nextRegistrationTime;
    if (result && result.autoRetry !== undefined) document.getElementById('autoRetry').checked = result.autoRetry;

    // Advanced settings
    if (result && result.mousePattern) document.getElementById('mousePattern').value = result.mousePattern;
    if (result && result.mouseSpeed) document.getElementById('mouseSpeed').value = result.mouseSpeed;
    if (result && result.complexity) document.getElementById('complexity').value = result.complexity;
    if (result && result.overshoot !== undefined) document.getElementById('overshoot').checked = result.overshoot;
    if (result && result.jitter !== undefined) document.getElementById('jitter').checked = result.jitter;
    if (result && result.randomPauses !== undefined) document.getElementById('randomPauses').checked = result.randomPauses;
    if (result && result.naturalTyping !== undefined) document.getElementById('naturalTyping').checked = result.naturalTyping;

    // Update slider values
    document.getElementById('beforeBotCheckDelayValue').textContent = (result && result.beforeBotCheckDelay) || 7;
    document.getElementById('retryIntervalValue').textContent = (result && result.retryInterval) || 5;
    document.getElementById('complexityValue').textContent = (result && result.complexity) || 5;

    // Enable start button if configured
    if (result && result.fullName && result.citizenId) {
      document.getElementById('startBtn').disabled = false;
    }
  } catch (error) {
    console.error('Error loading config:', error);
    showNotification('Lỗi khi tải cấu hình', 'error');
  }
}

// Save configuration
async function saveConfig(e) {
  e.preventDefault();

  const config = {
    fullName: document.getElementById('fullName').value,
    citizenId: document.getElementById('citizenId').value,
    area: document.getElementById('area').value,
    transactionPoint: document.getElementById('transactionPoint').value,
    telegramToken: document.getElementById('telegramToken').value,
    telegramChatId: document.getElementById('telegramChatId').value,
    beforeBotCheckDelay: parseInt(document.getElementById('beforeBotCheckDelay').value),
    retryInterval: parseInt(document.getElementById('retryInterval').value),
    nextRegistrationTime: document.getElementById('nextRegistrationTime').value,
    autoRetry: document.getElementById('autoRetry').checked
  };

  console.log('Saving configuration:', config);

  try {
    // Use callback for Firefox compatibility
    await new Promise((resolve, reject) => {
      chrome.storage.local.set(config, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });

    console.log('Configuration saved successfully');
    showNotification('Đã lưu cấu hình!', 'success');
    document.getElementById('startBtn').disabled = false;

    // Verify save by reading back
    const saved = await chrome.storage.local.get(Object.keys(config));
    console.log('Verified saved config:', saved);
  } catch (error) {
    console.error('Error saving config:', error);
    showNotification('Lỗi khi lưu cấu hình: ' + error.message, 'error');
  }
}

// Save advanced settings
async function saveAdvancedSettings() {
  const settings = {
    mousePattern: document.getElementById('mousePattern').value,
    mouseSpeed: document.getElementById('mouseSpeed').value,
    complexity: parseInt(document.getElementById('complexity').value),
    overshoot: document.getElementById('overshoot').checked,
    jitter: document.getElementById('jitter').checked,
    randomPauses: document.getElementById('randomPauses').checked,
    naturalTyping: document.getElementById('naturalTyping').checked
  };

  console.log('Saving advanced settings:', settings);

  try {
    // Use callback for Firefox compatibility
    await new Promise((resolve, reject) => {
      chrome.storage.local.set(settings, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });

    console.log('Advanced settings saved successfully');
    showNotification('Đã lưu cài đặt nâng cao!', 'success');

    // Verify save
    const saved = await chrome.storage.local.get(Object.keys(settings));
    console.log('Verified saved settings:', saved);
  } catch (error) {
    console.error('Error saving advanced settings:', error);
    showNotification('Lỗi khi lưu cài đặt: ' + error.message, 'error');
  }
}

// Get Chat ID from Telegram
async function getChatId() {
  const token = document.getElementById('telegramToken').value;

  if (!token) {
    showNotification('Vui lòng nhập Bot Token trước', 'error');
    return;
  }

  showNotification('Đang lấy Chat ID...', 'info');

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await response.json();

    if (data.ok && data.result.length > 0) {
      const chatId = data.result[0].message.chat.id;
      document.getElementById('telegramChatId').value = chatId;
      showNotification(`Chat ID: ${chatId}`, 'success');
    } else {
      showNotification('Không tìm thấy tin nhắn. Hãy gửi tin nhắn cho bot trước!', 'error');
    }
  } catch (error) {
    console.error('Error getting chat ID:', error);
    showNotification('Lỗi khi lấy Chat ID', 'error');
  }
}

// Test Telegram notification
async function testTelegram() {
  const token = document.getElementById('telegramToken').value;
  const chatId = document.getElementById('telegramChatId').value;

  if (!token || !chatId) {
    showNotification('Vui lòng nhập đầy đủ Bot Token và Chat ID', 'error');
    return;
  }

  showNotification('Đang gửi tin nhắn test...', 'info');

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✅ Test thành công! SJC Slot Bot đã được cấu hình đúng.',
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (data.ok) {
      showNotification('Đã gửi tin nhắn test thành công!', 'success');
    } else {
      showNotification('Lỗi: ' + data.description, 'error');
    }
  } catch (error) {
    console.error('Error testing Telegram:', error);
    showNotification('Lỗi khi gửi tin nhắn test', 'error');
  }
}

// Start bot
async function startBot() {
  try {
    const SJC_URL = 'https://tructuyen.sjc.com.vn/dang-nhap';
    let targetTab = null;
    let isNewTab = false;

    // Get current tab (Firefox fix: use callback pattern)
    const tabs = await new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (result) => {
        resolve(result || []);
      });
    });
    const currentTab = tabs && tabs.length > 0 ? tabs[0] : null;
    console.log('Current tab:', currentTab);

    // Check if current tab is on SJC website
    if (currentTab && currentTab.url && currentTab.url.includes('tructuyen.sjc.com.vn')) {
      targetTab = currentTab;
      console.log('Using current tab:', targetTab.id);
    } else {
      // Check if SJC tab already exists (Firefox fix: use callback pattern)
      const allTabs = await new Promise((resolve) => {
        chrome.tabs.query({ url: 'https://tructuyen.sjc.com.vn/*' }, (result) => {
          resolve(result || []);
        });
      });
      console.log('Found SJC tabs:', allTabs.length);

      if (allTabs && allTabs.length > 0) {
        // Use existing SJC tab
        targetTab = allTabs[0];
        await chrome.tabs.update(targetTab.id, { active: true });
        console.log('Switching to existing SJC tab:', targetTab.id);
        showNotification('Chuyển sang tab SJC hiện có...', 'info');
        // Wait a bit for tab to become active
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Create new tab with SJC URL (Firefox fix: use callback pattern)
        console.log('Creating new tab with URL:', SJC_URL);
        showNotification('Đang mở trang đăng ký SJC...', 'info');

        targetTab = await new Promise((resolve, reject) => {
          chrome.tabs.create({ url: SJC_URL, active: true }, (tab) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else if (!tab) {
              reject(new Error('Tab creation returned undefined'));
            } else {
              resolve(tab);
            }
          });
        });

        isNewTab = true;

        if (!targetTab || !targetTab.id) {
          throw new Error('Created tab is invalid or has no ID');
        }

        console.log('✓ Created new SJC tab:', targetTab.id);

        // Wait for page to load completely
        console.log('Waiting for page to load...');
        await new Promise((resolve) => {
          const listener = (tabId, changeInfo, tab) => {
            if (tabId === targetTab.id && changeInfo.status === 'complete') {
              console.log('Page load complete, URL:', tab.url);
              chrome.tabs.onUpdated.removeListener(listener);
              resolve();
            }
          };
          chrome.tabs.onUpdated.addListener(listener);

          // Timeout after 30 seconds
          setTimeout(() => {
            chrome.tabs.onUpdated.removeListener(listener);
            console.log('Page load timeout, continuing anyway...');
            resolve();
          }, 30000);
        });

        // Extra wait for content script injection and initialization
        console.log('Waiting for content script to initialize...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Verify we have a valid tab before proceeding
    if (!targetTab || !targetTab.id) {
      throw new Error('No valid target tab available');
    }

    // Send message to content script with retry logic
    console.log('📨 Sending start message to tab:', targetTab.id);
    let messageSuccess = false;
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`  Attempt ${attempt}/3 to send start message...`);
        const response = await chrome.tabs.sendMessage(targetTab.id, { action: 'start' });
        console.log('✓ Content script response:', response);
        messageSuccess = true;
        break;
      } catch (error) {
        lastError = error;
        console.error(`  ✗ Attempt ${attempt} failed:`, error.message);

        if (attempt < 3) {
          console.log('  Waiting 1 second before retry...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    if (!messageSuccess) {
      throw new Error(`Failed to communicate with content script after 3 attempts: ${lastError?.message || 'Unknown error'}`);
    }

    // Update UI
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'block';

    // Update status
    updateStatusDisplay('running', 'Đang chạy...');

    showNotification('✅ Bot đã khởi động!', 'success');

    // Close popup to let content script take control
    console.log('✅ Bot started successfully, closing popup in 1 second...');
    setTimeout(() => {
      window.close();
    }, 1000);

  } catch (error) {
    console.error('❌ Error starting bot:', error);
    console.error('Error stack:', error.stack);
    showNotification('❌ Lỗi khi khởi động bot: ' + error.message, 'error');

    // Reset UI on error
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById('stopBtn').style.display = 'none';
  }
}

// Stop bot
async function stopBot() {
  try {
    // Get current tab (Firefox fix: use callback pattern)
    const tabs = await new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (result) => {
        resolve(result || []);
      });
    });

    if (!tabs || tabs.length === 0) {
      showNotification('Không thể xác định tab hiện tại', 'error');
      return;
    }
    const tab = tabs[0];

    // Send message to content script to stop
    await chrome.tabs.sendMessage(tab.id, { action: 'stop' });

    // Update UI
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById('stopBtn').style.display = 'none';

    // Update status
    updateStatusDisplay('inactive', 'Đã dừng');

    showNotification('Đã dừng bot!', 'success');
  } catch (error) {
    console.error('Error stopping bot:', error);
    showNotification('Lỗi khi dừng bot', 'error');
  }
}

// Update status display
function updateStatusDisplay(state, text) {
  const indicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');

  indicator.className = `status-indicator ${state}`;
  statusText.textContent = text;
}

// Update status from background
async function updateStatus() {
  try {
    // Use callback pattern for Firefox compatibility
    const result = await new Promise((resolve) => {
      chrome.storage.local.get(['botStatus', 'attemptCount', 'successCount'], (items) => {
        resolve(items || {}); // Firefox fix
      });
    });

    if (result && result.botStatus) {
      updateStatusDisplay(result.botStatus.state, result.botStatus.text);

      if (result.botStatus.state === 'running') {
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('stopBtn').style.display = 'block';
      }
    }

    if (result && (result.attemptCount || result.successCount)) {
      document.getElementById('attemptsInfo').style.display = 'flex';
      document.getElementById('attemptCount').textContent = result.attemptCount || 0;
      document.getElementById('successCount').textContent = result.successCount || 0;
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Try to use Chrome notifications
  if (chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: 'SJC Slot Bot',
      message: message
    });
  }

  // Also show in popup
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Listen for status updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'statusUpdate') {
    updateStatusDisplay(message.state, message.text);

    if (message.attemptCount !== undefined) {
      document.getElementById('attemptCount').textContent = message.attemptCount;
    }

    if (message.successCount !== undefined) {
      document.getElementById('successCount').textContent = message.successCount;
    }
  }
});
