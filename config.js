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
    // Add your email configuration here if needed
    // service: "gmail",
    // user: "your-email@gmail.com",
    // password: "your-app-password",
    // to: "recipient@email.com"
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
