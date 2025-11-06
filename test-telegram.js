import axios from 'axios';
import config from './config.js';

/**
 * Test Telegram notification functionality
 *
 * Usage: node test-telegram.js
 */

(async () => {
  try {
    console.log('\n🧪 Testing Telegram notification...\n');

    if (!config.telegram.enabled) {
      console.log('❌ Telegram is disabled in config.js');
      console.log('Please set telegram.enabled = true\n');
      return;
    }

    if (!config.telegram.botToken) {
      console.log('❌ Bot token is missing in config.js');
      console.log('Please add your Telegram bot token\n');
      return;
    }

    if (!config.telegram.chatId) {
      console.log('❌ Chat ID is missing in config.js');
      console.log('Please add your Telegram chat ID');
      console.log('Run: node get-chat-id.js YOUR_BOT_TOKEN\n');
      return;
    }

    console.log('📤 Sending test message...');
    console.log(`Bot Token: ${config.telegram.botToken.substring(0, 20)}...`);
    console.log(`Chat ID: ${config.telegram.chatId}\n`);

    const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;
    const message = `
🧪 <b>Test Notification</b>

✅ Your Telegram bot is configured correctly!

<b>Configuration Details:</b>
🤖 Bot Token: ${config.telegram.botToken.substring(0, 20)}...
💬 Chat ID: ${config.telegram.chatId}
⏰ Time: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}

<i>You will receive notifications like this when the bot runs.</i>
`;

    const response = await axios.post(url, {
      chat_id: config.telegram.chatId,
      text: message,
      parse_mode: 'HTML'
    });

    if (response.data.ok) {
      console.log('✅ Test message sent successfully!');
      console.log('📱 Check your Telegram to see the message\n');
      console.log('✨ Your bot is ready to use!');
      console.log('Run: npm start\n');
    } else {
      console.log('❌ Failed to send message');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }

  } catch (error) {
    console.log('\n❌ Error sending test message:\n');

    if (error.response) {
      console.log('API Error:', error.response.data);

      if (error.response.data.error_code === 400) {
        console.log('\n💡 This usually means:');
        console.log('1. Chat ID is incorrect');
        console.log('2. You haven\'t started a chat with your bot');
        console.log('\nSolution:');
        console.log('1. Open Telegram and search for your bot');
        console.log('2. Click "Start" or send any message');
        console.log('3. Run: node get-chat-id.js YOUR_BOT_TOKEN');
        console.log('4. Update config.js with the correct chat ID\n');
      } else if (error.response.data.error_code === 401) {
        console.log('\n💡 Bot token is invalid or expired');
        console.log('Please check your bot token in config.js\n');
      }
    } else {
      console.log(error.message);
      console.log('\n💡 Please check:');
      console.log('1. Internet connection');
      console.log('2. Bot token is correct');
      console.log('3. Chat ID is correct\n');
    }
  }
})();
