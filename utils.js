import axios from 'axios';
import nodemailer from 'nodemailer';
import config from './config.js';

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate bezier curve points for smooth mouse movement
 * Supports cubic (4 points) and quadratic (3 points) curves
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
 * Generate arc curve points for smooth mouse movement
 */
function arcCurve(start, end, t, arcHeight = 0.3) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Create an arc perpendicular to the line
  const midX = start.x + dx * t;
  const midY = start.y + dy * t;

  // Add perpendicular offset for arc effect
  const perpX = -dy / distance;
  const perpY = dx / distance;

  // Maximum arc height at t=0.5, diminishes towards endpoints
  const arcOffset = distance * arcHeight * Math.sin(t * Math.PI);

  return {
    x: midX + perpX * arcOffset,
    y: midY + perpY * arcOffset
  };
}

/**
 * Generate zigzag pattern for erratic mouse movement
 */
function zigzagCurve(start, end, t, zigzagIntensity = 0.1) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const baseX = start.x + dx * t;
  const baseY = start.y + dy * t;

  // Add zigzag perpendicular to movement direction
  const zigzagOffset = Math.sin(t * Math.PI * 8) * zigzagIntensity * 50;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const perpX = -dy / (distance || 1);
  const perpY = dx / (distance || 1);

  return {
    x: baseX + perpX * zigzagOffset,
    y: baseY + perpY * zigzagOffset
  };
}

/**
 * Calculate movement steps based on distance and speed setting
 */
function calculateSteps(distance, speed) {
  const baseSteps = {
    slow: distance / 10,
    medium: distance / 20,
    fast: distance / 30,
    random: distance / randomBetween(15, 25)
  };

  return Math.max(10, Math.floor(baseSteps[speed] || baseSteps.medium));
}

/**
 * Generate control points for bezier curves with complexity
 */
function generateControlPoints(start, end, complexity, deviation) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Base control points
  const t1 = 0.25 + (Math.random() - 0.5) * 0.1 * complexity / 5;
  const t2 = 0.75 + (Math.random() - 0.5) * 0.1 * complexity / 5;

  const controlPoint1 = {
    x: start.x + dx * t1 + (Math.random() - 0.5) * deviation * complexity / 5,
    y: start.y + dy * t1 + (Math.random() - 0.5) * deviation * complexity / 5
  };

  const controlPoint2 = {
    x: start.x + dx * t2 + (Math.random() - 0.5) * deviation * complexity / 5,
    y: start.y + dy * t2 + (Math.random() - 0.5) * deviation * complexity / 5
  };

  return { controlPoint1, controlPoint2 };
}

/**
 * Move mouse in a human-like way to a specific element with advanced patterns
 */
export async function humanLikeMouseMove(page, element, customConfig = {}) {
  try {
    // Merge custom config with global config
    const moveConfig = { ...config.mouseMovement, ...customConfig };

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
    let targetX = box.x + box.width / 2 + (Math.random() - 0.5) * box.width * 0.3;
    let targetY = box.y + box.height / 2 + (Math.random() - 0.5) * box.height * 0.3;

    const distance = Math.sqrt(Math.pow(targetX - currentPos.x, 2) + Math.pow(targetY - currentPos.y, 2));

    // Calculate steps based on speed setting
    const steps = calculateSteps(distance, moveConfig.speed);

    // Select movement pattern
    const patterns = ['bezier', 'arc', 'zigzag', 'random'];
    const pattern = moveConfig.pattern === 'random'
      ? patterns[randomBetween(0, patterns.length - 1)]
      : moveConfig.pattern;

    // Generate movement path based on pattern
    let getPosition;
    let controlPoint1, controlPoint2;

    switch (pattern) {
      case 'bezier':
        ({ controlPoint1, controlPoint2 } = generateControlPoints(
          currentPos,
          { x: targetX, y: targetY },
          moveConfig.complexity,
          moveConfig.bezier.controlPointDeviation
        ));
        getPosition = (t) => bezierCurve(
          currentPos,
          { x: targetX, y: targetY },
          controlPoint1,
          controlPoint2,
          t
        );
        break;

      case 'arc':
        const arcHeight = 0.2 + (moveConfig.complexity / 50);
        getPosition = (t) => arcCurve(
          currentPos,
          { x: targetX, y: targetY },
          t,
          arcHeight
        );
        break;

      case 'zigzag':
        const zigzagIntensity = moveConfig.complexity / 10;
        getPosition = (t) => zigzagCurve(
          currentPos,
          { x: targetX, y: targetY },
          t,
          zigzagIntensity
        );
        break;

      default:
        // Linear movement with jitter
        getPosition = (t) => ({
          x: currentPos.x + (targetX - currentPos.x) * t,
          y: currentPos.y + (targetY - currentPos.y) * t
        });
    }

    // Move mouse along the path
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let pos = getPosition(t);

      // Add jitter if enabled
      if (moveConfig.jitter && Math.random() < 0.3) {
        pos.x += (Math.random() - 0.5) * 5 * moveConfig.jitterIntensity;
        pos.y += (Math.random() - 0.5) * 5 * moveConfig.jitterIntensity;
      }

      await page.mouse.move(pos.x, pos.y);

      // Random pauses during movement (thinking/hesitation)
      if (Math.random() < moveConfig.pauseProbability) {
        const pauseDuration = randomBetween(
          moveConfig.pauseDuration[0],
          moveConfig.pauseDuration[1]
        );
        await sleep(pauseDuration);
      }

      // Micro-pauses for natural movement
      if (Math.random() > 0.7) {
        await sleep(randomBetween(5, 15));
      }
    }

    // Overshoot and correction
    if (moveConfig.overshoot && Math.random() < moveConfig.overshootProbability) {
      const overshootDistance = randomBetween(10, 30);
      const overshootAngle = Math.random() * Math.PI * 2;

      const overshootX = targetX + Math.cos(overshootAngle) * overshootDistance;
      const overshootY = targetY + Math.sin(overshootAngle) * overshootDistance;

      // Move past target
      await page.mouse.move(overshootX, overshootY);
      await sleep(randomBetween(50, 150));

      // Correct back to target
      await page.mouse.move(targetX, targetY);
    } else {
      // Ensure we end exactly on target
      await page.mouse.move(targetX, targetY);
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
 * Create email transporter based on configuration
 */
function createEmailTransporter(emailConfig) {
  let transportOptions;

  if (emailConfig.service && emailConfig.service !== 'smtp') {
    // Use predefined service (gmail, outlook, etc.)
    transportOptions = {
      service: emailConfig.service,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password
      }
    };
  } else {
    // Use custom SMTP settings
    transportOptions = emailConfig.smtp;
  }

  return nodemailer.createTransporter(transportOptions);
}

/**
 * Generate HTML email template
 */
function generateEmailHTML(success, details) {
  const statusColor = success ? '#10B981' : '#EF4444';
  const statusIcon = success ? '✅' : '⚠️';
  const statusText = success ? 'SUCCESS' : 'FAILED';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%);
          color: white;
          border-radius: 10px 10px 0 0;
          margin: -30px -30px 20px -30px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .status-badge {
          display: inline-block;
          padding: 10px 20px;
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          margin-top: 10px;
          font-size: 18px;
        }
        .details {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: bold;
          min-width: 140px;
          color: #6b7280;
        }
        .detail-value {
          color: #111827;
          flex: 1;
        }
        .message {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .error-message {
          background: #fee2e2;
          border-left: 4px solid #ef4444;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusIcon} SJC Slot Registration</h1>
          <div class="status-badge">${statusText}</div>
        </div>

        ${success ? `
          <div class="message">
            <strong>🎉 Registration Successful!</strong>
            <p>Your slot has been successfully registered.</p>
          </div>
        ` : `
          <div class="message error-message">
            <strong>❌ Registration Failed</strong>
            <p>The registration attempt was unsuccessful. The bot will retry automatically.</p>
          </div>
        `}

        <div class="details">
          <h3 style="margin-top: 0;">Registration Details</h3>
          ${Object.entries(details).map(([key, value]) => `
            <div class="detail-row">
              <div class="detail-label">${key}:</div>
              <div class="detail-value">${value}</div>
            </div>
          `).join('')}
        </div>

        <div class="footer">
          <p><strong>SJC Slot Registration Bot</strong></p>
          <p>Automated notification system</p>
          <p style="font-size: 12px; color: #9ca3af;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send email notification
 */
export async function sendEmailNotification(success, details, errorMessage = '') {
  try {
    const emailConfig = config.email;

    if (!emailConfig.enabled) {
      return { skipped: true, reason: 'Email notifications disabled' };
    }

    if (!emailConfig.user || !emailConfig.password) {
      throw new Error('Email credentials not configured');
    }

    if (!emailConfig.to) {
      throw new Error('Recipient email not configured');
    }

    // Create transporter
    const transporter = createEmailTransporter(emailConfig);

    // Prepare email details
    const emailDetails = { ...details };
    if (!success && errorMessage) {
      emailDetails['Error Message'] = errorMessage;
    }

    // Generate HTML content
    const htmlContent = generateEmailHTML(success, emailDetails);

    // Plain text version
    const textContent = Object.entries(emailDetails)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    // Email options
    const mailOptions = {
      from: emailConfig.template.from || emailConfig.user,
      to: emailConfig.to,
      cc: emailConfig.cc || undefined,
      bcc: emailConfig.bcc || undefined,
      subject: success
        ? emailConfig.template.subjectSuccess
        : emailConfig.template.subjectFailure,
      text: textContent,
      html: htmlContent
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };

  } catch (error) {
    console.error('Failed to send email notification:', error.message);
    throw error;
  }
}

/**
 * Send notifications via all enabled channels
 */
export async function sendNotifications(success, details, errorMessage = '') {
  const results = {
    telegram: null,
    email: null
  };

  // Send Telegram notification
  if (config.telegram.enabled && config.telegram.chatId) {
    try {
      const timestamp = getTimestamp();
      let message;

      if (success) {
        message = `
🎉 <b>SJC Slot Registration - SUCCESS</b>

✅ Successfully registered slot!

<b>Details:</b>
${Object.entries(details).map(([key, value]) => `${key}: ${value}`).join('\n')}

⏰ Time: ${timestamp}
`;
      } else {
        message = `
⚠️ <b>SJC Slot Registration - FAILED</b>

❌ Registration attempt failed

<b>Error:</b>
${errorMessage || 'Unknown error'}

<b>Details:</b>
${Object.entries(details).map(([key, value]) => `${key}: ${value}`).join('\n')}

⏰ Time: ${timestamp}

🔄 Will retry shortly...
`;
      }

      results.telegram = await sendTelegramNotification(
        config.telegram.botToken,
        config.telegram.chatId,
        message
      );
    } catch (error) {
      results.telegram = { error: error.message };
    }
  }

  // Send Email notification
  if (config.email.enabled) {
    try {
      results.email = await sendEmailNotification(success, details, errorMessage);
    } catch (error) {
      results.email = { error: error.message };
    }
  }

  return results;
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
