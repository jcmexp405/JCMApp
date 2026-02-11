import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  orderBy,
  addDoc
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
  const typesSnap = await getDocs(query(collection(db, 'documentType'), orderBy('title', 'asc')));
  const types = typesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const userDocsSnap = await getDocs(
    query(collection(db, 'documents'), where('user', '==', userId))
  );
  const userDocs = userDocsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const byType = userDocs.reduce((acc, doc) => {
    const typeId = doc.documentType;
    if (!typeId) return acc;

    if (!acc[typeId]) acc[typeId] = [];
    acc[typeId].push(doc);
    return acc;
  }, {});

  return types.map((t) => {
    const docsForType = (byType[t.id] || [])
      .filter((d) => !!d.document)
      .sort((a, b) => {
        const ai = a.fileIndex ?? 9999;
        const bi = b.fileIndex ?? 9999;
        if (ai !== bi) return ai - bi;

        const as = a.lastUpdate?.seconds ?? a.lastUpdate?.toDate?.()?.getTime?.() ?? 0;
        const bs = b.lastUpdate?.seconds ?? b.lastUpdate?.toDate?.()?.getTime?.() ?? 0;
        return as - bs;
      });

    const files = docsForType.map((d, idx) => ({
      id: d.id,
      url: d.document,
      name: d.fileName || `Archivo ${idx + 1}`,
      lastUpdate: d.lastUpdate
    }));

    const lastDoc = docsForType.reduce((latest, d) => {
      const curr = d.lastUpdate?.seconds ?? d.lastUpdate?.toDate?.()?.getTime?.() ?? 0;
      const prev = latest?.lastUpdate?.seconds ?? latest?.lastUpdate?.toDate?.()?.getTime?.() ?? 0;
      return curr > prev ? d : latest;
    }, null);

    return {
      ...t,
      document: files[0]?.url,
      lastUpdate: lastDoc?.lastUpdate,
      user: userId,
      files
    };
  });
};

export const postUserRequest = async (user) => {
  return await addDoc(collection(db, 'requests'), {
    name: user.USER,
    email: user.EMAIL,
    date: new Date(),
    status: 'pending'
  });
};
