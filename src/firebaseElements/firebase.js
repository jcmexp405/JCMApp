import { initializeApp } from 'firebase/app';
import { Capacitor } from '@capacitor/core';
import { initializeAuth, getAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth con configuración específica para Capacitor
let auth;

if (Capacitor.isNativePlatform()) {
  console.log('📱 Initializing Firebase Auth for native platform (iOS/Android)');
  // For native platforms, we'll use the Capacitor Firebase Authentication plugin
  auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence
  });
} else {
  console.log('🌐 Initializing Firebase Auth for web');
  auth = getAuth(app);
}

export { auth, FirebaseAuthentication };
export default app;
