import { db } from './firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from 'firebase/firestore';

export type InviteRole = 'user' | 'admin';

function generateInviteToken(length = 32) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  let token = '';
  const available = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length * 2; i += 1) {
    token += available[Math.floor(Math.random() * available.length)];
  }
  return token;
}

export const getInvite = async (token: string) => {
  const ref = doc(db, 'invites', token);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() as { role: InviteRole; createdBy: string; createdAt: number; used: boolean; usedBy?: string; usedAt?: number; email?: string } : null;
};

export const createInvite = async (role: InviteRole, createdBy: string) => {
  const token = generateInviteToken(24);
  const ref = doc(db, 'invites', token);
  await setDoc(ref, {
    role,
    createdBy,
    createdAt: Date.now(),
    used: false,
  });
  return token;
};

export const redeemInviteAndCreateProfile = async (
  uid: string,
  email: string,
  inviteToken: string,
  role: InviteRole,
) => {
  const batch = writeBatch(db);
  batch.set(doc(db, 'users', uid), {
    uid,
    role,
    inviteToken,
    email,
    createdAt: Date.now(),
  });
  batch.update(doc(db, 'invites', inviteToken), {
    used: true,
    usedBy: uid,
    usedAt: Date.now(),
    email: email || null,
  });
  await batch.commit();
};

export const listUnusedInvites = async () => {
  const snap = await getDocs(query(collection(db, 'invites'), where('used', '==', false)));
  return snap.docs.map((entry) => ({
    token: entry.id,
    ...(entry.data() as { role: InviteRole; createdBy: string; createdAt: number; email?: string | null }),
  }));
};

export const revokeInvite = async (token: string) => {
  await deleteDoc(doc(db, 'invites', token));
};

export const PROFILE_READ_TIMEOUT_MS = 10000;

// Um getDoc sem resposta (rede pendurada) nao pode ser lido como "documento ausente":
// sem este prazo o boot ficaria esperando para sempre ou cairia no logout por conta nao autorizada.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('profile-timeout')), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, 'users', uid);
  const snap = await withTimeout(getDoc(ref), PROFILE_READ_TIMEOUT_MS);
  return snap.exists() ? snap.data() as { uid: string; role: InviteRole; inviteToken: string; email?: string; createdAt: number } : null;
};

export const createUserProfile = async (uid: string, role: InviteRole, inviteToken: string | null, email: string) => {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    uid,
    role,
    inviteToken,
    email,
    createdAt: Date.now(),
  });
};

export const isFirstAdminAvailable = async () => {
  const ref = doc(db, 'metadata', 'firstAdmin');
  const snap = await getDoc(ref);
  return !snap.exists();
};

export const markFirstAdminCreated = async (uid: string) => {
  const ref = doc(db, 'metadata', 'firstAdmin');
  await setDoc(ref, {
    createdBy: uid,
    createdAt: Date.now(),
    role: 'admin',
  });
};
