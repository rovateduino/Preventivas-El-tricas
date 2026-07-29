import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Preventiva } from '../types';

const COLLECTION = 'preventivas';

export const savePreventiva = async (preventiva: Omit<Preventiva, 'id' | 'criadoEm' | 'atualizadoEm'> & { uid: string }) => {
  const now = Date.now();
  const ref = await addDoc(collection(db, COLLECTION), {
    ...preventiva,
    criadoEm: now,
    atualizadoEm: now,
  });
  return ref.id;
};

export const getPreventivas = async (uid: string) => {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid), orderBy('criadoEm', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Preventiva));
};

export const deletePreventiva = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
