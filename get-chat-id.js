import axios from 'axios';

/**
 * Helper script to get your Telegram Chat ID
 *
 * Usage:
 * 1. Start a chat with your bot on Telegram
 * 2. Send any message to your bot
 * 3. Run: node get-chat-id.js YOUR_BOT_TOKEN
 */

const botToken = process.argv[2];

if (!botToken) {
  console.log('\n❌ Error: Bot token is required\n');
  console.log('Usage: node get-chat-id.js YOUR_BOT_TOKEN\n');
  console.log('Example: node get-chat-id.js 7730228914:AAHFsw8Oi-vBu0y_TxwEmlf0Chac5OyGAe8\n');
  process.exit(1);
}

(async () => {
  try {
    console.log('\n🔍 Fetching chat ID...\n');

    const url = `https://api.telegram.org/bot${botToken}/getUpdates`;
    const response = await axios.get(url);

    if (!response.data.ok) {
      throw new Error('Invalid bot token or API error');
    }

    const updates = response.data.result;

    if (updates.length === 0) {
      console.log('❌ No messages found!\n');
      console.log('Please:');
      console.log('1. Start a chat with your bot on Telegram');
      console.log('2. Send any message to your bot');
      console.log('3. Run this script again\n');
      return;
    }

    console.log('✅ Found messages! Here are your chat IDs:\n');

    const chatIds = new Set();
    updates.forEach((update, index) => {
      if (update.message) {
        const chatId = update.message.chat.id;
        const username = update.message.chat.username || 'N/A';
        const firstName = update.message.chat.first_name || '';
        const lastName = update.message.chat.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        if (!chatIds.has(chatId)) {
          chatIds.add(chatId);
          console.log(`Chat ID: ${chatId}`);
          console.log(`Name: ${fullName}`);
          console.log(`Username: @${username}`);
          console.log('─'.repeat(40));
        }
      }
    });

    console.log('\n✅ Copy one of the Chat IDs above and add it to your config.js:\n');
    console.log('telegram: {');
    console.log('  enabled: true,');
    console.log(`  botToken: "${botToken}",`);
    console.log(`  chatId: "${Array.from(chatIds)[0]}" // <-- Add this`);
    console.log('}\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\nPlease check:');
    console.log('1. Your bot token is correct');
    console.log('2. You have internet connection');
    console.log('3. You have sent a message to your bot\n');
  }
})();
