import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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

export const markInviteAsUsed = async (token: string, usedBy: string, email?: string) => {
  const ref = doc(db, 'invites', token);
  await updateDoc(ref, {
    used: true,
    usedBy,
    usedAt: Date.now(),
    email: email || null,
  });
};

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
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
