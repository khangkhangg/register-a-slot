export default {
  // User credentials
  credentials: {
    name: "Nguyễn Thị Thu Hương",
    citizenId: "031193003423"
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
    botToken: "7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8",
    chatId: "" // You need to get your chat ID - see README
  },

  // Email configuration (optional)
  email: {
    enabled: false,

    // Email service provider (gmail, outlook, yahoo, etc.)
    service: "gmail", // or use 'smtp' for custom SMTP settings

    // Your email credentials
    user: "your-email@gmail.com",
    password: "your-app-password", // For Gmail: use App Password, not regular password

    // Recipient email(s) - can be string or array
    to: "recipient@email.com", // or ["email1@example.com", "email2@example.com"]

    // Optional: CC and BCC
    cc: "", // Carbon copy
    bcc: "", // Blind carbon copy

    // Optional: Custom SMTP settings (if service is 'smtp')
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password"
      }
    },

    // Email template settings
    template: {
      from: '"SJC Slot Bot" <your-email@gmail.com>',
      subjectSuccess: "✅ SJC Slot Registration - SUCCESS",
      subjectFailure: "⚠️ SJC Slot Registration - FAILED",
      includeDetails: true
    }
  },

  // Mouse movement configuration
  mouseMovement: {
    // Movement pattern: 'bezier', 'arc', 'zigzag', 'random'
    pattern: 'bezier',

    // Speed: 'slow', 'medium', 'fast', 'random'
    speed: 'medium',

    // Curve complexity (1-10, higher = more random/human-like)
    complexity: 5,

    // Enable overshoot and correction (mouse goes past target then corrects)
    overshoot: true,
    overshootProbability: 0.3, // 30% chance of overshoot

    // Add random micro-movements during travel
    jitter: true,
    jitterIntensity: 0.5, // 0-1, amount of jitter

    // Pause during movement (thinking/hesitation)
    pauseProbability: 0.2, // 20% chance of pause during movement
    pauseDuration: [50, 300], // Random pause duration range (ms)

    // Control point randomization for Bezier curves
    bezier: {
      controlPointDeviation: 100, // How far control points can deviate
      useDoubleControlPoints: true // Use 4 control points instead of 2
    }
  },

  // Browser configuration
  browser: {
    headless: false, // Set to true for production
    slowMo: 50, // Slow down actions by 50ms to appear more human
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
