# Advanced Features Guide

This document details the advanced features of the SJC Slot Registration Bot, including email notifications and customizable mouse movement patterns.

## Table of Contents

1. [Email Notifications](#email-notifications)
2. [Advanced Mouse Movement Patterns](#advanced-mouse-movement-patterns)
3. [Configuration Examples](#configuration-examples)

---

## Email Notifications

The bot supports sending beautiful HTML email notifications in addition to Telegram notifications. You can receive detailed reports about registration attempts via email.

### Features

- ✅ **Professional HTML Templates**: Beautiful, responsive email design
- ✅ **Success & Failure Notifications**: Different templates for each status
- ✅ **Multiple Recipients**: Send to one or more email addresses
- ✅ **CC/BCC Support**: Carbon copy and blind carbon copy
- ✅ **Multiple Email Services**: Gmail, Outlook, Yahoo, custom SMTP
- ✅ **Customizable Templates**: Modify subjects and content

### Setup Guide

#### For Gmail Users

1. **Enable 2-Step Verification:**
   - Visit: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Configure in `config.js`:**
   ```javascript
   email: {
     enabled: true,
     service: "gmail",
     user: "your-email@gmail.com",
     password: "your-16-char-app-password",  // Not your regular password!
     to: "recipient@email.com",

     template: {
       from: '"SJC Slot Bot" <your-email@gmail.com>',
       subjectSuccess: "✅ SJC Slot Registration - SUCCESS",
       subjectFailure: "⚠️ SJC Slot Registration - FAILED"
     }
   }
   ```

4. **Test Configuration:**
   ```bash
   npm run test:email
   ```

#### For Other Email Services

**Outlook/Hotmail:**
```javascript
email: {
  enabled: true,
  service: "hotmail",
  user: "your-email@outlook.com",
  password: "your-password",
  to: "recipient@email.com"
}
```

**Yahoo:**
```javascript
email: {
  enabled: true,
  service: "yahoo",
  user: "your-email@yahoo.com",
  password: "your-app-password",  // Generate from Yahoo account settings
  to: "recipient@email.com"
}
```

**Custom SMTP:**
```javascript
email: {
  enabled: true,
  service: "smtp",  // Use custom SMTP
  smtp: {
    host: "smtp.your-provider.com",
    port: 587,
    secure: false,
    auth: {
      user: "your-email@domain.com",
      pass: "your-password"
    }
  },
  to: "recipient@email.com"
}
```

### Advanced Email Configuration

#### Multiple Recipients

```javascript
email: {
  to: ["email1@example.com", "email2@example.com"],
  cc: "manager@example.com",
  bcc: "archive@example.com"
}
```

#### Custom Email Templates

```javascript
email: {
  template: {
    from: '"My Custom Bot" <bot@example.com>',
    subjectSuccess: "🎉 Success - Slot Reserved!",
    subjectFailure: "⚠️ Failed - Retry in Progress",
    includeDetails: true  // Include registration details
  }
}
```

### Email Notification Examples

**Success Email:**
- Professional green gradient header
- Success icon and message
- Registration details table
- Timestamp and attempt number

**Failure Email:**
- Red gradient header
- Error details
- Troubleshooting information
- Next retry information

### Troubleshooting Email

**Problem: Authentication Failed**
```
Solution for Gmail:
1. Use App Password, not regular password
2. Enable 2-Step Verification
3. Generate new App Password
4. Update config.js with new password
```

**Problem: Connection Timeout**
```
Solution:
1. Check internet connection
2. Verify SMTP settings
3. Check firewall settings
4. Try different port (587 or 465)
```

**Problem: Email Not Received**
```
Solution:
1. Check spam/junk folder
2. Verify recipient email is correct
3. Test with npm run test:email
4. Check email service logs
```

---

## Advanced Mouse Movement Patterns

The bot features sophisticated mouse movement algorithms that simulate natural human cursor behavior. This is crucial for avoiding bot detection.

### Movement Patterns

#### 1. Bezier Curve (Default)
Smooth, curved mouse paths using cubic Bezier curves.

```javascript
mouseMovement: {
  pattern: 'bezier',
  complexity: 5  // 1-10, higher = more curved
}
```

**Characteristics:**
- Natural curved paths
- Adjustable control points
- Variable complexity
- Most human-like pattern

**Best for:** General use, form filling, clicking

#### 2. Arc Pattern
Mouse moves in an arc, creating a parabolic path.

```javascript
mouseMovement: {
  pattern: 'arc',
  complexity: 7
}
```

**Characteristics:**
- Parabolic arc motion
- Perpendicular offset from direct line
- Smooth acceleration/deceleration
- Natural for reaching distant elements

**Best for:** Long-distance movements, buttons in corners

#### 3. Zigzag Pattern
Erratic, slightly jittery movement.

```javascript
mouseMovement: {
  pattern: 'zigzag',
  complexity: 3  // Lower is better for zigzag
}
```

**Characteristics:**
- Sinusoidal deviation from path
- Appears slightly uncertain
- Mimics imprecise mouse control
- More "nervous" movement

**Best for:** Making the bot appear less perfect

#### 4. Random Pattern
Randomly selects a pattern for each movement.

```javascript
mouseMovement: {
  pattern: 'random'
}
```

**Characteristics:**
- Unpredictable movement style
- Varies between all patterns
- Maximum variation
- Hardest to detect

**Best for:** Maximum stealth, high-security sites

### Movement Speed

Control how fast the mouse moves:

```javascript
mouseMovement: {
  speed: 'slow'      // Very deliberate, careful
  speed: 'medium'    // Natural human speed (default)
  speed: 'fast'      // Quick but not instant
  speed: 'random'    // Varies each movement
}
```

**Speed Examples:**
- **Slow**: ~1 second for 500px
- **Medium**: ~0.5 seconds for 500px
- **Fast**: ~0.3 seconds for 500px

### Overshoot & Correction

Simulates human tendency to overshoot target and correct:

```javascript
mouseMovement: {
  overshoot: true,
  overshootProbability: 0.3  // 30% chance per movement
}
```

**How it works:**
1. Mouse approaches target
2. Occasionally goes past target (10-30px)
3. Brief pause
4. Corrects back to exact position

**Best for:** Appearing less robotic, high-security forms

### Jitter (Micro-movements)

Adds tiny random movements during travel:

```javascript
mouseMovement: {
  jitter: true,
  jitterIntensity: 0.5  // 0-1 scale
}
```

**Effect:**
- Small perpendicular deviations (±2-5px)
- Mimics hand tremor
- Makes path less perfect
- Subtle but effective

### Movement Pauses

Random hesitation during movement:

```javascript
mouseMovement: {
  pauseProbability: 0.2,        // 20% chance
  pauseDuration: [50, 300]      // 50-300ms pause
}
```

**Simulates:**
- Thinking/hesitation
- Re-targeting
- Distraction
- Natural uncertainty

### Complexity Setting

Master control for movement randomization:

```javascript
mouseMovement: {
  complexity: 1   // Very simple, almost linear
  complexity: 5   // Balanced (default)
  complexity: 10  // Highly randomized, very human
}
```

**What complexity affects:**
- Control point deviation
- Curve randomization
- Path unpredictability
- Overall "human-ness"

---

## Configuration Examples

### Maximum Stealth Configuration

For heavily monitored websites with aggressive bot detection:

```javascript
// config.js
export default {
  // ... other settings

  mouseMovement: {
    pattern: 'random',           // Vary pattern each time
    speed: 'random',             // Vary speed each time
    complexity: 8,               // High randomization
    overshoot: true,
    overshootProbability: 0.4,   // 40% chance
    jitter: true,
    jitterIntensity: 0.7,        // High jitter
    pauseProbability: 0.25,      // 25% pause chance
    pauseDuration: [100, 500],   // Longer pauses
    bezier: {
      controlPointDeviation: 150,
      useDoubleControlPoints: true
    }
  },

  timing: {
    beforeBotCheckMin: 10000,    // 10-15 seconds wait
    beforeBotCheckMax: 15000
  },

  browser: {
    headless: false,
    slowMo: 100                  // Slow down all actions
  }
};
```

### Balanced Configuration

Good balance between speed and stealth:

```javascript
mouseMovement: {
  pattern: 'bezier',
  speed: 'medium',
  complexity: 5,
  overshoot: true,
  overshootProbability: 0.3,
  jitter: true,
  jitterIntensity: 0.5,
  pauseProbability: 0.2,
  pauseDuration: [50, 300],
  bezier: {
    controlPointDeviation: 100,
    useDoubleControlPoints: true
  }
}
```

### Fast Configuration

When speed is priority over stealth:

```javascript
mouseMovement: {
  pattern: 'bezier',
  speed: 'fast',
  complexity: 3,
  overshoot: false,
  jitter: false,
  pauseProbability: 0.1,
  pauseDuration: [20, 100],
  bezier: {
    controlPointDeviation: 50,
    useDoubleControlPoints: false
  }
}
```

### Ultra-Realistic Configuration

Maximum human-like behavior:

```javascript
mouseMovement: {
  pattern: 'random',
  speed: 'random',
  complexity: 10,
  overshoot: true,
  overshootProbability: 0.5,
  jitter: true,
  jitterIntensity: 0.8,
  pauseProbability: 0.3,
  pauseDuration: [100, 600],
  bezier: {
    controlPointDeviation: 200,
    useDoubleControlPoints: true
  }
},

timing: {
  beforeBotCheckMin: 8000,
  beforeBotCheckMax: 15000,
  retryIntervalMin: 10 * 60 * 1000,
  retryIntervalMax: 30 * 60 * 1000
},

browser: {
  slowMo: 150
}
```

---

## Testing Mouse Movements

To visualize different mouse movement patterns:

1. **Enable visible browser:**
   ```javascript
   browser: { headless: false }
   ```

2. **Run the bot:**
   ```bash
   npm start
   ```

3. **Watch the mouse movement** patterns in action

4. **Adjust settings** based on what looks most natural

---

## Best Practices

### For Email Notifications

1. **Use App Passwords** for Gmail (never regular password)
2. **Test before deploying** with `npm run test:email`
3. **Check spam folder** if emails don't arrive
4. **Use multiple recipients** for redundancy
5. **Keep credentials secure** (don't commit to git)

### For Mouse Movements

1. **Start with default settings** (balanced)
2. **Increase complexity** if bot is detected
3. **Enable overshoot** for better human simulation
4. **Use 'random' pattern** for maximum stealth
5. **Adjust based on website** behavior
6. **Test with visible browser** first

### General Tips

1. **Combine both features** for maximum effectiveness
2. **Monitor notifications** for success/failure patterns
3. **Adjust timing** based on detection attempts
4. **Use headless mode** only after testing
5. **Keep logs** for troubleshooting

---

## Performance Impact

### Email Notifications
- **Memory**: +20-30 MB
- **CPU**: Minimal
- **Speed**: ~1-3 seconds per email
- **Network**: ~5-10 KB per email

### Advanced Mouse Movement
- **Memory**: Minimal
- **CPU**: Very low
- **Speed Impact**:
  - Fast: +0.2s per movement
  - Medium: +0.5s per movement
  - Slow: +1s per movement
- **Network**: None

---

## Troubleshooting

### Email Issues

**Error: EAUTH - Authentication failed**
- Use App Password for Gmail
- Enable 2-Step Verification
- Check email/password are correct

**Error: ECONNECTION - Connection timeout**
- Check internet connection
- Verify SMTP host and port
- Check firewall settings

**Error: EENVELOPE - Invalid address**
- Verify email format
- Check recipient email
- Test with different email

### Mouse Movement Issues

**Bot detected despite advanced movements**
- Increase complexity to 8-10
- Enable random pattern
- Increase overshoot probability
- Add more pauses
- Slow down (slowMo: 100-200)

**Mouse movements too slow**
- Decrease complexity
- Use 'fast' speed
- Reduce pause probability
- Disable overshoot

**Mouse movements look robotic**
- Enable jitter
- Enable overshoot
- Use random pattern
- Increase complexity
- Add more pauses

---

## Examples in Action

### Full Configuration Example

```javascript
// config.js - Complete example with all features
export default {
  credentials: {
    name: "Your Name",
    citizenId: "0123456789"
  },

  formData: {
    area: "Thành phố Hồ Chí Minh",
    transactionPoint: "TRỤ SỞ - TRUNG TÂM VÀNG BẠC ĐÁ QUÝ - SJC"
  },

  timing: {
    beforeBotCheckMin: 8000,
    beforeBotCheckMax: 12000,
    retryIntervalMin: 5 * 60 * 1000,
    retryIntervalMax: 15 * 60 * 1000
  },

  telegram: {
    enabled: true,
    botToken: "your-bot-token",
    chatId: "your-chat-id"
  },

  email: {
    enabled: true,
    service: "gmail",
    user: "your-email@gmail.com",
    password: "your-app-password",
    to: ["primary@email.com", "backup@email.com"],
    cc: "",
    bcc: "",
    template: {
      from: '"SJC Bot" <your-email@gmail.com>',
      subjectSuccess: "✅ Slot Reserved Successfully!",
      subjectFailure: "⚠️ Registration Failed - Retrying"
    }
  },

  mouseMovement: {
    pattern: 'random',
    speed: 'medium',
    complexity: 7,
    overshoot: true,
    overshootProbability: 0.35,
    jitter: true,
    jitterIntensity: 0.6,
    pauseProbability: 0.25,
    pauseDuration: [80, 400],
    bezier: {
      controlPointDeviation: 120,
      useDoubleControlPoints: true
    }
  },

  browser: {
    headless: false,
    slowMo: 80
  }
};
```

---

## Support

For issues with these features:

1. Check this documentation
2. Test with provided test scripts
3. Review logs for errors
4. Adjust configuration incrementally
5. Report issues with detailed logs

---

**Happy automating with advanced features! 🚀**
