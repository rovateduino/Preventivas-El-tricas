import { db } from './firebase';
import { collection, setDoc, writeBatch, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Preventiva } from '../types';

const COLLECTION = 'preventivas';

function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, entryValue]) => {
      if (entryValue !== undefined) {
        acc[key] = stripUndefinedDeep(entryValue);
      }
      return acc;
    }, {} as Record<string, unknown>) as T;
  }

  return value;
}

// `criadoEm` é ordenado pelo Firestore: se uns documentos gravam número e outros
// string ISO, a ordenação por data quebra. ISO-8601 em todos os caminhos de escrita.
function toIsoString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value).toISOString();
  if (typeof value === 'string' && value.trim()) return value.trim();
  return new Date().toISOString();
}

function normalizeTimestamps<T extends Record<string, any>>(record: T): T {
  return {
    ...record,
    criadoEm: toIsoString(record.criadoEm),
    atualizadoEm: toIsoString(record.atualizadoEm),
  };
}

function normalizePreventivaRecord(record: any, uid: string) {
  const id = String(record.id || `${uid}-${Date.now()}`).trim();

  return stripUndefinedDeep(normalizeTimestamps({
    ...record,
    id,
    uid,
  }));
}

// O id nasce aqui, no cliente, e é devolvido para a tela guardar em tentativa: reenviar o
// mesmo formulário escreve no MESMO documento em vez de abrir um segundo.
export const newPreventivaDocId = () => doc(collection(db, COLLECTION)).id;

export const savePreventiva = async (preventiva: Omit<Preventiva, 'id' | 'criadoEm' | 'atualizadoEm'> & { uid: string }, docId: string) => {
  const { id: _idForaDoPayload, ...rest } = preventiva as Preventiva;
  const payload = stripUndefinedDeep(normalizeTimestamps(rest));
  await setDoc(doc(db, COLLECTION, docId), payload);
  return docId;
};

export const updatePreventiva = async (id: string, preventiva: Record<string, unknown> & { uid: string }) => {
  const { id: _ignoredId, ...rest } = preventiva;
  const payload = stripUndefinedDeep(normalizeTimestamps(rest));
  await setDoc(
    doc(db, COLLECTION, id),
    payload,
    { merge: true },
  );
};

// Ids de documento são derivados do uid para que dois usuários importem o mesmo
// backup sem sobrescrever os documentos um do outro, e a mesma pessoa reimporte
// sem criar duplicatas.
function importDocId(uid: string, rawId: string) {
  const prefix = `${uid}-import-`;
  const original = rawId.startsWith(prefix) ? rawId.slice(prefix.length) : rawId;
  return `${prefix}${original}`;
}

const BATCH_LIMIT = 400;

export const importPreventivas = async (records: any[], uid: string) => {
  const normalized = records.map((record) => {
    const base = normalizePreventivaRecord(record, uid);
    return { ...base, id: importDocId(uid, base.id) };
  });

  for (let i = 0; i < normalized.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    normalized.slice(i, i + BATCH_LIMIT).forEach((record) => {
      batch.set(doc(db, COLLECTION, record.id), record);
    });
    await batch.commit();
  }

  return normalized;
};

export const getPreventivas = async (uid: string) => {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid), orderBy('criadoEm', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => normalizeTimestamps({ ...doc.data(), id: doc.id }) as Preventiva);
};

export const deletePreventiva = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id));
};

export const deletePreventivas = async (ids: string[]) => {
  for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    ids.slice(i, i + BATCH_LIMIT).forEach((id) => {
      batch.delete(doc(db, COLLECTION, id));
    });
    await batch.commit();
  }
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
