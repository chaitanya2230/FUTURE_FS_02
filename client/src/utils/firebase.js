import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Retrieve credentials with robust fallback to retrieved active Firebase App config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCK5bD39kI4wGUw-XoPbbeGKJ74OrgOF0A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lenovo-monitor-store.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lenovo-monitor-store",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lenovo-monitor-store.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "327015886479",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:327015886479:web:0945494cfcda4ab9a04afa"
};

// Initialize Firebase App instance
const app = initializeApp(firebaseConfig);

// Export Auth instance for client routing
export const auth = getAuth(app);
export default app;
