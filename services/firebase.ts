import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration (replace with your own config from Firebase Console)
const firebaseConfig = {
  apiKey: "your-api hammered",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);