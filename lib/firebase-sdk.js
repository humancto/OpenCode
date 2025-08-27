// Initialize Firebase
// IMPORTANT: Replace these with your own Firebase project credentials
// Get them from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general
var config = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID"
};

// Validate configuration
if (config.apiKey === "YOUR_API_KEY") {
  console.error('⚠️ Firebase not configured! Please update firebase-sdk.js with your credentials.');
  console.log('📖 Follow the setup instructions in README.md to get your Firebase credentials.');
} else {
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
}