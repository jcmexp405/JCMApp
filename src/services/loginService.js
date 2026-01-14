import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import app, { auth } from '../firebaseElements/firebase';

const db = getFirestore(app);

export const userLogin = async (email, password) => {
  const response = await signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const userData = await getUserData(user.uid);
      return {
        uid: user.uid,
        ...userData
      };
    })
    .catch((error) => {
      return {
        code: error.code,
        message: error.message
      };
    });
  return response;
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

export const logOut = () => {
  signOut(auth)
    .then(() => {
      console.log('se cerro la sesion');
    })
    .catch((error) => {
      console.log(error);
    });
};

export const resetPassWord = (email) => {
  return sendPasswordResetEmail(auth, email);
};
