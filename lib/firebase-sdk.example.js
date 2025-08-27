// Example Firebase Configuration
// 
// SETUP INSTRUCTIONS:
// 1. Copy this file to firebase-sdk.js in the same directory
// 2. Replace the placeholder values with your Firebase project credentials
// 3. Get these from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general

var config = {
  apiKey: "YOUR_API_KEY",                          // Example: "AIzaSyD..."
  authDomain: "YOUR_PROJECT.firebaseapp.com",      // Example: "my-app.firebaseapp.com"
  databaseURL: "https://YOUR_PROJECT.firebaseio.com", // Example: "https://my-app.firebaseio.com"
  storageBucket: "YOUR_PROJECT.appspot.com",       // Example: "my-app.appspot.com"
  messagingSenderId: "YOUR_SENDER_ID"              // Example: "123456789"
};

// Initialize Firebase
console.log('🔥 Initializing Firebase...');
firebase.initializeApp(config);

// Test Firebase connection
firebase.database().ref('.info/connected').on('value', function(snapshot) {
  if (snapshot.val() === true) {
    console.log('✅ Firebase connected successfully!');
  } else {
    console.log('⚠️ Firebase disconnected');
  }
});