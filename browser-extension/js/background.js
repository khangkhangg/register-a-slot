// Background service worker for SJC Slot Registration Bot

console.log('SJC Slot Bot: Background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');

    // Open welcome page
    chrome.tabs.create({
      url: 'popup.html'
    });

    // Set default configuration
    chrome.storage.local.set({
      beforeBotCheckDelay: 7,
      retryInterval: 5,
      autoRetry: true,
      mousePattern: 'bezier',
      mouseSpeed: 'medium',
      complexity: 5,
      overshoot: true,
      jitter: true,
      randomPauses: true,
      naturalTyping: true
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated to version ' + chrome.runtime.getManifest().version);
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.action === 'notification') {
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: message.title || 'SJC Slot Bot',
      message: message.message,
      priority: 2
    });
  }

  sendResponse({ received: true });
  return true;
});

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open extension popup or SJC website
  chrome.tabs.create({
    url: 'https://tructuyen.sjc.com.vn/dang-nhap'
  });
});

// Handle browser action (extension icon) click
chrome.action.onClicked.addListener((tab) => {
  // This is handled by default_popup in manifest, but keep for fallback
  console.log('Extension icon clicked');
});

// Keep service worker alive
let keepAliveInterval = null;

function keepAlive() {
  if (keepAliveInterval === null) {
    keepAliveInterval = setInterval(() => {
      console.log('Keep alive ping');
    }, 20000); // Every 20 seconds
  }
}

keepAlive();

// Clean up on shutdown
chrome.runtime.onSuspend.addListener(() => {
  console.log('Service worker suspending');
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
});
