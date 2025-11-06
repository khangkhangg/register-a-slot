import config from './config.js';
import { sendEmailNotification, getTimestamp } from './utils.js';

/**
 * Test email notification functionality
 *
 * Usage: node test-email.js
 */

(async () => {
  try {
    console.log('\n🧪 Testing Email notification...\n');

    if (!config.email.enabled) {
      console.log('❌ Email is disabled in config.js');
      console.log('Please set email.enabled = true\n');
      return;
    }

    if (!config.email.user) {
      console.log('❌ Email user is missing in config.js');
      console.log('Please add your email address\n');
      return;
    }

    if (!config.email.password) {
      console.log('❌ Email password is missing in config.js');
      console.log('Please add your email app password');
      console.log('\n💡 For Gmail:');
      console.log('1. Go to https://myaccount.google.com/security');
      console.log('2. Enable 2-Step Verification');
      console.log('3. Go to App Passwords');
      console.log('4. Generate a new app password');
      console.log('5. Use that password in config.js\n');
      return;
    }

    if (!config.email.to) {
      console.log('❌ Recipient email is missing in config.js');
      console.log('Please add the recipient email address\n');
      return;
    }

    console.log('📤 Sending test email...');
    console.log(`From: ${config.email.user}`);
    console.log(`To: ${config.email.to}`);
    console.log(`Service: ${config.email.service}\n`);

    // Test details
    const testDetails = {
      '📋 Name': config.credentials.name,
      '🆔 Citizen ID': config.credentials.citizenId,
      '📍 Area': config.formData.area,
      '🏢 Transaction Point': config.formData.transactionPoint,
      '🔄 Attempt': '#1',
      '⏰ Time': getTimestamp(),
      '🧪 Test Mode': 'Yes - This is a test notification'
    };

    // Send test success email
    console.log('Sending SUCCESS test email...');
    const successResult = await sendEmailNotification(
      true,
      testDetails,
      ''
    );

    if (successResult.success) {
      console.log('✅ SUCCESS test email sent successfully!');
      console.log(`Message ID: ${successResult.messageId}`);
      console.log(`Response: ${successResult.response}\n`);
    } else if (successResult.skipped) {
      console.log(`⚠️ Email skipped: ${successResult.reason}\n`);
    }

    // Wait a bit before sending failure test
    console.log('Waiting 3 seconds before sending FAILURE test email...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Send test failure email
    console.log('Sending FAILURE test email...');
    const failureResult = await sendEmailNotification(
      false,
      testDetails,
      'This is a test error message to demonstrate failure notifications.'
    );

    if (failureResult.success) {
      console.log('✅ FAILURE test email sent successfully!');
      console.log(`Message ID: ${failureResult.messageId}`);
      console.log(`Response: ${failureResult.response}\n`);
    }

    console.log('✅ Email test completed!');
    console.log('📧 Check your inbox to see the test emails\n');
    console.log('✨ Your email notifications are configured correctly!');
    console.log('Run: npm start\n');

  } catch (error) {
    console.log('\n❌ Error sending test email:\n');
    console.error(error);

    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. This usually means:');
      console.log('1. Email or password is incorrect');
      console.log('2. For Gmail: You need to use an App Password, not your regular password');
      console.log('3. For Gmail: 2-Step Verification must be enabled\n');
      console.log('📖 Gmail App Password setup:');
      console.log('   1. Visit: https://myaccount.google.com/security');
      console.log('   2. Enable 2-Step Verification');
      console.log('   3. Search for "App Passwords"');
      console.log('   4. Generate password for "Mail" app');
      console.log('   5. Use that 16-character password in config.js\n');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.log('\n💡 Connection error. Please check:');
      console.log('1. Your internet connection');
      console.log('2. SMTP settings are correct');
      console.log('3. Firewall is not blocking SMTP ports (587 or 465)\n');
    } else if (error.code === 'EENVELOPE') {
      console.log('\n💡 Invalid email address. Please check:');
      console.log('1. "from" email is valid');
      console.log('2. "to" email is valid');
      console.log('3. Email addresses are properly formatted\n');
    } else {
      console.log('\n💡 Please check:');
      console.log('1. Email configuration in config.js');
      console.log('2. SMTP settings are correct');
      console.log('3. Email credentials are valid\n');
    }

    console.log('📖 Configuration example for Gmail:');
    console.log(`
email: {
  enabled: true,
  service: "gmail",
  user: "your-email@gmail.com",
  password: "your-16-char-app-password",  // Not your regular password!
  to: "recipient@email.com",
  template: {
    from: '"SJC Bot" <your-email@gmail.com>',
    subjectSuccess: "✅ SJC Slot Registration - SUCCESS",
    subjectFailure: "⚠️ SJC Slot Registration - FAILED"
  }
}
    `);
  }
})();
