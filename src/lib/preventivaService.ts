import { db } from './firebase';
import { collection, addDoc, setDoc, writeBatch, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Preventiva } from '../types';

const COLLECTION = 'preventivas';

function normalizePreventivaRecord(record: any, uid: string) {
  const now = Date.now();
  const id = String(record.id || `${uid}-${now}`).trim();

  return {
    ...record,
    id,
    uid,
    criadoEm: record.criadoEm ?? now,
    atualizadoEm: record.atualizadoEm ?? now,
  };
}

export const savePreventiva = async (preventiva: Omit<Preventiva, 'id' | 'criadoEm' | 'atualizadoEm'> & { uid: string }) => {
  const now = Date.now();
  const ref = await addDoc(collection(db, COLLECTION), {
    ...preventiva,
    criadoEm: now,
    atualizadoEm: now,
  });
  return ref.id;
};

export const importPreventivas = async (records: any[], uid: string) => {
  const batch = writeBatch(db);
  const normalized = records.map((record) => normalizePreventivaRecord(record, uid));

  normalized.forEach((record) => {
    const ref = doc(db, COLLECTION, record.id);
    batch.set(ref, record);
  });

  await batch.commit();
  return normalized;
};

export const getPreventivas = async (uid: string) => {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid), orderBy('criadoEm', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Preventiva));
};

export const deletePreventiva = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id));
};

export const deleteAllPreventivas = async (uid: string) => {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  if (snapshot.docs.length === 0) return 0;
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.delete(doc(db, COLLECTION, d.id));
  });
  await batch.commit();
  return snapshot.docs.length;
};
