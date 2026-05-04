// src/firebase.js
// This file initializes Firebase and exports the Firestore database instance

import { initializeApp } from 'firebase/app'
import { getFirestore }  from 'firebase/firestore'

// Your Firebase project configuration
// These values come from the Firebase console → Project settings → Your apps
const firebaseConfig = {
  apiKey:            "AIzaSyDqjR-NSRSW6VbcNNJXhdNfhWXlgtbwq_Y",
  authDomain:        "task-logger-a26ba.firebaseapp.com",
  projectId:         "task-logger-a26ba",
  storageBucket:     "task-logger-a26ba.firebasestorage.app",
  messagingSenderId: "1004329050406",
  appId:             "1:1004329050406:web:75417db290a8fb36ada1e7",
}

// Initialize the Firebase app with the config above
const app = initializeApp(firebaseConfig)

// Export the Firestore database so other files can use it
export const db = getFirestore(app)