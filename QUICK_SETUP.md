# 🚀 Quick Setup - 2 Steps Only!

## Step 1: Configure Firebase
Edit `lib/firebase-sdk.js` and replace with your Firebase credentials:

```javascript
var config = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id"
};
```

**How to get these credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (free)
3. Go to Project Settings > General
4. Scroll down to "Your apps" > Click "Web" icon
5. Copy the config values

## Step 2: Run the App
```bash
python3 -m http.server 8000
```

Open http://localhost:8000

**That's it!** ✅

---

## Important Notes:
- **Firebase is the ONLY configuration needed**
- Everything else works out of the box
- The free Firebase plan is sufficient for interviews
- No need to install Node.js, npm, or any dependencies