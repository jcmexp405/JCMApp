import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  orderBy
} from 'firebase/firestore/lite';
import app from '../firebaseElements/firebase';

const db = getFirestore(app);
const auth = getAuth();

export const getAllUsers = async () => {
  const usersCol = query(collection(db, 'accounts'), where('type', '==', 'user'));
  const usersSnapshot = await getDocs(usersCol);
  const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return usersList;
};

export const postNewUser = async (user) => {
  const { USER_NAME, EMAIL, PASSWORD, COMPANY } = user;
  return await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD)
    .then(async (userCredential) => {
      await setDoc(doc(db, 'accounts', userCredential.user.uid), {
        company: COMPANY,
        email: EMAIL,
        name: USER_NAME,
        type: 'user'
      });
      return {
        message: 'Success'
      };
    })
    .catch((error) => {
      return {
        message: 'Error',
        error
      };
    });
};

export const getUserDocument = async (userId, cathegoryId) => {
  const documentCol = query(
    collection(db, 'documents'),
    where('documentType', '==', cathegoryId),
    where('user', '==', userId)
  );
  const documentSnapshot = await getDocs(documentCol);
  const documentsList = documentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return documentsList;
};

export const getUserDocuments = async (userId) => {
  const documentsCol = query(collection(db, 'documentType'), orderBy('title', 'asc'));
  const documentsSnapshot = await getDocs(documentsCol);
  const documentsList = documentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const newDocumentList = await Promise.all(
    documentsList.map(async (document) => {
      const response = await getUserDocument(userId, document.id);
      return {
        ...document,
        ...response[0]
      };
    })
  );
  return newDocumentList;
};
