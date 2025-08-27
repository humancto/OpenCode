# 🛠️ Detailed Setup Guide

This guide will walk you through setting up OpenCode step-by-step with screenshots and troubleshooting tips.

## Prerequisites

- A Google account (for Firebase)
- Basic knowledge of git and command line
- 10 minutes of your time

## Step 1: Firebase Project Setup

### 1.1 Create a Firebase Project

1. Navigate to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or **"Add project"**
3. Enter a project name (e.g., `my-interview-platform`)
   - This will generate a unique ID like `my-interview-platform-abc123`
4. **Disable Google Analytics** (not needed for this project)
5. Click **"Create project"** and wait ~30 seconds

### 1.2 Get Your Configuration

1. Once created, click the **gear icon** ⚙️ in the left sidebar
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **"</>"** (Web) icon
5. Register app with a nickname (e.g., "OpenCode Web App")
6. You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "my-project.firebaseapp.com",
  databaseURL: "https://my-project.firebaseio.com",
  projectId: "my-project",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

**Save these values!** You'll need them in Step 3.

## Step 2: Enable Realtime Database

### 2.1 Create Database

1. In Firebase Console, click **"Realtime Database"** in the left sidebar
2. Click **"Create Database"**
3. Choose a location (select the closest to your users):
   - `us-central1` for USA
   - `europe-west1` for Europe
   - `asia-southeast1` for Asia
4. Select **"Start in test mode"** (we'll secure it later)
5. Click **"Enable"**

### 2.2 Set Security Rules

1. Once created, click the **"Rules"** tab
2. Replace the default rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Click **"Publish"**

⚠️ **Warning**: These rules allow anyone to read/write. This is fine for testing but should be secured for production.

## Step 3: Configure OpenCode

### 3.1 Clone the Repository

```bash
git clone https://github.com/yourusername/opencode.git
cd opencode
```

### 3.2 Update Firebase Configuration

Edit `lib/firebase-sdk.js`:

```javascript
var config = {
  apiKey: "AIzaSyD...",  // Your actual API key
  authDomain: "my-project.firebaseapp.com",  // Your auth domain
  databaseURL: "https://my-project.firebaseio.com",  // Your database URL
  storageBucket: "my-project.appspot.com",  // Your storage bucket
  messagingSenderId: "123456789"  // Your sender ID
};
```

### 3.3 Set Admin Credentials

Edit `scripts/auth.js`:

```javascript
const ADMIN_CREDENTIALS = {
  email: 'john@mycompany.com',      // Your email
  password: 'MySecurePass123!'      // Your password (make it strong!)
};
```

⚠️ **Security Note**: Never commit real credentials to GitHub! These are client-side and visible to users.

## Step 4: Deploy to Firebase Hosting

### 4.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 4.2 Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### 4.3 Update Project ID

Edit `.firebaserc`:

```json
{
  "projects": {
    "default": "my-project-id"  // Your actual project ID from Firebase Console
  }
}
```

### 4.4 Deploy

```bash
firebase deploy
```

You'll see output like:
```
=== Deploying to 'my-project'...
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/my-project/overview
Hosting URL: https://my-project.web.app
```

🎉 **Your app is now live!** Visit the Hosting URL to see it.

## Step 5: Test Your Setup

### 5.1 Test as Admin

1. Visit your hosting URL
2. Click **"Login as Admin"**
3. Enter your admin credentials
4. Click **"Create New Session"**
5. You should see a 6-digit code like `123456`

### 5.2 Test as Candidate

1. Open an incognito/private browser window
2. Visit the same URL
3. Click **"Join as Candidate"**
4. Enter any name
5. Enter the 6-digit code from step 5.1
6. Click **"Join Session"**

### 5.3 Test Collaboration

1. Type some code in either window
2. You should see it appear in real-time in both windows
3. Try changing the language, theme, and running code

## Step 6: Production Security (Important!)

### 6.1 Secure Database Rules

For production, update your Firebase Database rules:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['firepad']) && $sessionId.matches(/^[0-9]{6}$/)"
      }
    },
    ".read": false,
    ".write": false
  }
}
```

### 6.2 Environment Variables (Optional)

For better security, you can:

1. Use Firebase Functions for sensitive operations
2. Implement proper authentication with Firebase Auth
3. Store credentials in environment variables (requires a build process)

## Troubleshooting

### Issue: "Permission denied" error

**Solution**: Check your database rules. Ensure they allow read/write access.

### Issue: Configuration not working

**Solution**: Make sure you copied ALL fields from Firebase config, including the full URLs with `https://`

### Issue: Can't deploy

**Solution**: 
1. Ensure you're logged in: `firebase login`
2. Check project ID matches: `firebase projects:list`
3. Try: `firebase use --add` and select your project

### Issue: Real-time sync not working

**Solution**:
1. Check browser console for errors (F12)
2. Verify Firebase configuration is correct
3. Ensure you're using HTTPS (not HTTP)
4. Try clearing browser cache

### Issue: Code execution not working

**Solution**: The Piston API (used for code execution) is a free public service. If it's down, code execution won't work. This doesn't affect the collaborative editing features.

## Local Development

For local testing without deployment:

```bash
# Python
python3 -m http.server 8080

# Then visit
http://localhost:8080
```

**Note**: Some features may not work over HTTP (like clipboard access). Use HTTPS or deploy to Firebase for full functionality.

## Next Steps

1. **Customize branding** - Update logo, colors, and text in `index.html` and `styles/main.css`
2. **Add features** - Check the README for the roadmap
3. **Monitor usage** - Keep an eye on Firebase Console for usage stats
4. **Get feedback** - Test with real users and iterate

## Need Help?

- Check existing [GitHub Issues](https://github.com/yourusername/opencode/issues)
- Read Firebase [documentation](https://firebase.google.com/docs)
- Ask in [Discussions](https://github.com/yourusername/opencode/discussions)

---

**Remember to ⭐ star the repo if it helped you!**