import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  serverTimestamp
} from 'firebase/firestore/lite';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import app from '../firebaseElements/firebase';

const storage = getStorage();

const db = getFirestore(app);
export const getAllDocumentCategories = async () => {
  const categoriesCol = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCol);
  const categoriesList = categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return categoriesList;
};

export const getAllDocumetsByCategory = async (userId, categoryId) => {
  const typesSnap = await getDocs(
    query(collection(db, 'documentType'), where('category', '==', categoryId))
  );

  const docTypes = typesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const docTypeIds = docTypes.map((t) => t.id);

  if (!docTypeIds.length) return [];

  const docsSnap = await getDocs(query(collection(db, 'documents'), where('user', '==', userId)));

  const userDocs = docsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const docsByType = {};
  for (const ud of userDocs) {
    if (!docTypeIds.includes(ud.documentType)) continue;

    if (!docsByType[ud.documentType]) docsByType[ud.documentType] = [];
    docsByType[ud.documentType].push(ud);
  }

  return docTypes.map((t) => {
    const files = (docsByType[t.id] || [])
      .sort((a, b) => (a.fileIndex ?? 999) - (b.fileIndex ?? 999))
      .map((d) => ({
        url: d.document,
        name: d.fileName || `Archivo ${d.fileIndex || ''}`.trim(),
        fileIndex: d.fileIndex ?? null,
        lastUpdate: d.lastUpdate
      }));

    const lastUpdate = files.length
      ? files.reduce((acc, f) => {
          const a = acc?.seconds || 0;
          const b = f?.lastUpdate?.seconds || 0;
          return b > a ? f.lastUpdate : acc;
        }, files[0].lastUpdate)
      : null;

    return {
      ...t,
      files,
      document: files[0]?.url || null,
      lastUpdate
    };
  });
};

export const getDocumentByDocumentType = async (uid, documentType) => {
  const documentCol = query(
    collection(db, 'documents'),
    where('documentType', '==', documentType),
    where('user', '==', uid)
  );
  const documentSnapshot = await getDocs(documentCol);
  const document = documentSnapshot.docs.map((doc) => doc.data());
  return document[0];
};

export const getAllCategoriesDocuments = async () => {
  const docsSnap = await getDocs(collection(db, 'documentType'));
  const documents = docsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data()
  }));

  const categoriesSnap = await getDocs(collection(db, 'categories'));

  const categoriesMap = Object.fromEntries(categoriesSnap.docs.map((d) => [d.id, d.data().title]));

  const enrichedDocs = documents.map((doc) => ({
    ...doc,
    categoryName: categoriesMap[doc.category] ?? 'Sin categoría'
  }));

  return enrichedDocs.sort((a, b) =>
    (a.title || '').localeCompare(b.title || '', 'es', {
      sensitivity: 'base'
    })
  );
};

export const postNewDocument = async (userId, documentURL, documentTypeId, meta = {}) => {
  return await addDoc(collection(db, 'documents'), {
    user: userId,
    documentType: documentTypeId,
    document: documentURL,
    fileIndex: meta.fileIndex ?? 1,
    fileName: meta.fileName ?? null,
    createdAt: serverTimestamp(),
    lastUpdate: serverTimestamp()
  });
};

export const postEditDocument = async (documentId, documentURL) => {
  return await updateDoc(doc(db, 'documents', documentId), {
    document: documentURL,
    lastUpdate: new Date()
  });
};

export const upsertUserDocumentFile = async ({
  userId,
  documentTypeId,
  fileIndex,
  documentURL,
  fileName
}) => {
  const q = query(
    collection(db, 'documents'),
    where('user', '==', userId),
    where('documentType', '==', documentTypeId),
    where('fileIndex', '==', fileIndex),
    limit(1)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    const existing = snap.docs[0];

    await updateDoc(doc(db, 'documents', existing.id), {
      document: documentURL,
      fileName: fileName || null,
      lastUpdate: serverTimestamp()
    });

    return { mode: 'update', documentId: existing.id, prevUrl: existing.data()?.document || null };
  }

  const created = await addDoc(collection(db, 'documents'), {
    user: userId,
    documentType: documentTypeId,
    fileIndex,
    document: documentURL,
    fileName: fileName || null,
    createdAt: serverTimestamp(),
    lastUpdate: serverTimestamp()
  });

  return { mode: 'create', documentId: created.id, prevUrl: null };
};

export const postNewCategory = async (category) => {
  const docRef = await addDoc(collection(db, 'categories'), {
    title: category.TITLE,
    icon: category.ICON
  });
  return { message: 'Success', id: docRef.id };
};

export const editCategory = async (categoryId, category) => {
  await updateDoc(doc(db, 'categories', categoryId), {
    title: category.TITLE,
    icon: category.ICON
  });
  return { message: 'Success' };
};

export const deleteCategory = async (categoryId) => {
  const q = query(collection(db, 'documentType'), where('category', '==', categoryId));

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    throw new Error('No se puede eliminar la categoría porque tiene documentos asociados.');
  }

  await deleteDoc(doc(db, 'categories', categoryId));
  return { success: true };
};

export const postNewDocumentType = async (payload) => {
  const docRef = await addDoc(collection(db, 'documentType'), payload);
  return docRef;
};
export const deleteDocumentType = async (documentTypeId) => {
  const q = query(collection(db, 'documents'), where('documentType', '==', documentTypeId));
  const snap = await getDocs(q);

  await Promise.all(
    snap.docs.map(async (docSnap) => {
      const { document: fileUrl } = docSnap.data();

      if (fileUrl) {
        try {
          await deleteObject(ref(storage, fileUrl));
        } catch (e) {
          console.warn('No se pudo borrar el archivo del storage:', e);
        }
      }

      await deleteDoc(doc(db, 'documents', docSnap.id));
    })
  );

  await deleteDoc(doc(db, 'documentType', documentTypeId));
  return { success: true };
};

export const editDocumentType = async (documentTypeId, values) => {
  await updateDoc(doc(db, 'documentType', documentTypeId), {
    title: values.title,
    category: values.category,
    icon: values.icon,
    maxFiles: values.maxFiles
  });

  return { message: 'Success' };
};
