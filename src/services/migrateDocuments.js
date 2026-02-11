import { collection, getDocs, query, updateDoc, doc, getFirestore } from 'firebase/firestore/lite';
import app from '../firebaseElements/firebase';
const db = getFirestore(app);

export const migrateDocumentsAddFileIndex = async () => {
  const q = query(collection(db, 'documents'));
  const snap = await getDocs(q);

  let counterMap = {};

  for (const d of snap.docs) {
    const data = d.data();
    const key = `${data.user}_${data.documentType}`;

    if (!counterMap[key]) counterMap[key] = 1;

    await updateDoc(doc(db, 'documents', d.id), {
      fileIndex: counterMap[key]
    });

    console.log(`✅ Updated ${d.id} -> fileIndex ${counterMap[key]}`);

    counterMap[key]++;
  }

  console.log('🎉 Migración finalizada');
};
