import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import { Capacitor } from '@capacitor/core';
import app, { auth, FirebaseAuthentication } from '../firebaseElements/firebase';

const db = getFirestore(app);

export const userLogin = async (email, password) => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Use Capacitor Firebase Authentication for native platforms
      const result = await FirebaseAuthentication.signInWithEmailAndPassword({
        email,
        password
      });

      const user = result.user;
      const userData = await getUserData(user.uid);
      return {
        uid: user.uid,
        ...userData
      };
    } else {
      // Use Firebase web SDK for web platform
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = await getUserData(user.uid);
      return {
        uid: user.uid,
        ...userData
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    // El plugin de Capacitor devuelve errorMessage, mientras que web SDK usa code
    return {
      code: error.code || 'auth/error',
      message: error.message || error.errorMessage || 'Error al iniciar sesión'
    };
  }
};

export const getUserData = async (uid) => {
  const ref = doc(db, 'accounts', uid);
  const userData = await getDoc(ref);
  const { type, name } = userData.data();
  return {
    type,
    name
  };
};

export const logOut = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await FirebaseAuthentication.signOut();
      console.log('se cerro la sesion (native)');
    } else {
      await signOut(auth);
      console.log('se cerro la sesion (web)');
    }
  } catch (error) {
    console.log(error);
  }
};

export const resetPassWord = async (email) => {
  if (Capacitor.isNativePlatform()) {
    return FirebaseAuthentication.sendPasswordResetEmail({ email });
  } else {
    return sendPasswordResetEmail(auth, email);
  }
};
