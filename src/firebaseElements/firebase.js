import { initializeApp } from 'firebase/app';
import { Capacitor } from '@capacitor/core';
import { initializeAuth, getAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

var firebaseConfig = {
  apiKey: 'AIzaSyDeJQuGv48Ei9k9JHIASzN8y-EjFAc8I_o',
  authDomain: 'jcmexpansion.firebaseapp.com',
  projectId: 'jcmexpansion',
  storageBucket: 'jcmexpansion.appspot.com',
  messagingSenderId: '116949457374',
  appId: '1:116949457374:web:96ef5869b81a7fd786e54f'
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
