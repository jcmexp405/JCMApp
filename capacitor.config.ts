import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jcmexp.app',
  appName: 'JCMExpansion',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['email']
    }
  },
  server: {
    //url: 'http://192.168.0.128:3000', // Tu IP y el puerto de npm start
    cleartext: true,
    androidScheme: 'https',

    // Permitir Google APIs
    allowNavigation: ['accounts.google.com', 'firebaseapp.com', '*.googleapis.com']
  },
  ios: {
    contentInset: 'automatic',
    // Configuración para Firebase Auth
    scheme: 'App',
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
