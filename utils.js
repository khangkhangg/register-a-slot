import axios from 'axios';

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate bezier curve points for smooth mouse movement
 */
function bezierCurve(start, end, controlPoint1, controlPoint2, t) {
  const x = Math.pow(1 - t, 3) * start.x +
            3 * Math.pow(1 - t, 2) * t * controlPoint1.x +
            3 * (1 - t) * Math.pow(t, 2) * controlPoint2.x +
            Math.pow(t, 3) * end.x;

  const y = Math.pow(1 - t, 3) * start.y +
            3 * Math.pow(1 - t, 2) * t * controlPoint1.y +
            3 * (1 - t) * Math.pow(t, 2) * controlPoint2.y +
            Math.pow(t, 3) * end.y;

  return { x, y };
}

/**
 * Move mouse in a human-like way to a specific element
 */
export async function humanLikeMouseMove(page, element) {
  try {
    // Get current mouse position
    const currentPos = await page.evaluate(() => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }));

    // Get element position
    const box = await element.boundingBox();
    if (!box) {
      throw new Error('Element not visible');
    }

    // Calculate target position (random point within element)
    const targetX = box.x + box.width / 2 + (Math.random() - 0.5) * box.width * 0.3;
    const targetY = box.y + box.height / 2 + (Math.random() - 0.5) * box.height * 0.3;

    // Generate control points for bezier curve
    const distance = Math.sqrt(Math.pow(targetX - currentPos.x, 2) + Math.pow(targetY - currentPos.y, 2));
    const steps = Math.max(10, Math.floor(distance / 20));

    const controlPoint1 = {
      x: currentPos.x + (targetX - currentPos.x) * 0.25 + (Math.random() - 0.5) * 100,
      y: currentPos.y + (targetY - currentPos.y) * 0.25 + (Math.random() - 0.5) * 100
    };

    const controlPoint2 = {
      x: currentPos.x + (targetX - currentPos.x) * 0.75 + (Math.random() - 0.5) * 100,
      y: currentPos.y + (targetY - currentPos.y) * 0.75 + (Math.random() - 0.5) * 100
    };

    // Move mouse along bezier curve
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pos = bezierCurve(
        currentPos,
        { x: targetX, y: targetY },
        controlPoint1,
        controlPoint2,
        t
      );

      await page.mouse.move(pos.x, pos.y);

      // Random micro-pauses to simulate human behavior
      if (Math.random() > 0.7) {
        await sleep(randomBetween(10, 30));
      }
    }

    // Small random delay before clicking
    await sleep(randomBetween(100, 300));

    return { x: targetX, y: targetY };
  } catch (error) {
    console.error('Error in human-like mouse move:', error.message);
    throw error;
  }
}

/**
 * Click an element with human-like behavior
 */
export async function humanLikeClick(page, element) {
  try {
    // Move mouse to element
    await humanLikeMouseMove(page, element);

    // Random delay before click
    await sleep(randomBetween(50, 150));

    // Click with slight random duration
    await page.mouse.down();
    await sleep(randomBetween(50, 100));
    await page.mouse.up();

    // Small delay after click
    await sleep(randomBetween(100, 300));
  } catch (error) {
    console.error('Error in human-like click:', error.message);
    throw error;
  }
}

/**
 * Type text with human-like speed and occasional typos/corrections
 */
export async function humanLikeType(page, element, text, options = {}) {
  const { typoChance = 0.05, correctionDelay = 300 } = options;

  await element.click();
  await sleep(randomBetween(100, 300));

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Simulate occasional typo
    if (Math.random() < typoChance && i < text.length - 1) {
      // Type wrong character
      const wrongChar = String.fromCharCode(char.charCodeAt(0) + randomBetween(-2, 2));
      await page.keyboard.type(wrongChar, { delay: randomBetween(80, 150) });
      await sleep(correctionDelay);

      // Delete it
      await page.keyboard.press('Backspace');
      await sleep(randomBetween(100, 200));
    }

    // Type correct character
    await page.keyboard.type(char, { delay: randomBetween(80, 150) });

    // Random pauses (thinking time)
    if (Math.random() > 0.85) {
      await sleep(randomBetween(200, 500));
    }
  }

  await sleep(randomBetween(100, 300));
}

/**
 * Send Telegram notification
 */
export async function sendTelegramNotification(botToken, chatId, message) {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    return response.data;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error.message);
    throw error;
  }
}

/**
 * Format date and time for logging
 */
export function getTimestamp() {
  const now = new Date();
  return now.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false
  });
}

/**
 * Log with timestamp
 */
export function log(message, type = 'INFO') {
  const timestamp = getTimestamp();
  const colors = {
    INFO: '\x1b[36m',    // Cyan
    SUCCESS: '\x1b[32m', // Green
    ERROR: '\x1b[31m',   // Red
    WARNING: '\x1b[33m', // Yellow
    RESET: '\x1b[0m'
  };

  const color = colors[type] || colors.INFO;
  console.log(`${color}[${timestamp}] [${type}]${colors.RESET} ${message}`);
}

/**
 * Wait for element with retry
 */
export async function waitForElement(page, selector, options = {}) {
  const { timeout = 30000, visible = true } = options;

  try {
    await page.waitForSelector(selector, { timeout, visible });
    return true;
  } catch (error) {
    log(`Element not found: ${selector}`, 'WARNING');
    return false;
  }
}

/**
 * Select dropdown option by text content
 */
export async function selectDropdownByText(page, selectSelector, optionText) {
  try {
    await page.waitForSelector(selectSelector, { timeout: 10000 });

    // Click to open dropdown
    await page.click(selectSelector);
    await sleep(randomBetween(300, 700));

    // Find and select option
    await page.evaluate((selector, text) => {
      const select = document.querySelector(selector);
      if (!select) throw new Error('Select element not found');

      const options = Array.from(select.options);
      const option = options.find(opt => opt.text.trim() === text);

      if (option) {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }

      throw new Error(`Option "${text}" not found`);
    }, selectSelector, optionText);

    await sleep(randomBetween(300, 700));
    return true;
  } catch (error) {
    log(`Failed to select dropdown option: ${error.message}`, 'ERROR');
    throw error;
  }
}
