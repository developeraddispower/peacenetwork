// Firebase Configuration
// Replace with your Firebase project config

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "pan-african-peace-network.firebaseapp.com",
    projectId: "pan-african-peace-network",
    storageBucket: "pan-african-peace-network.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other files
// In production, use ES6 modules or include this before other scripts
console.log('🔥 Firebase initialized');
