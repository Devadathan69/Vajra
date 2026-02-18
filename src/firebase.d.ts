
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';

export const auth: Auth;
export const db: Firestore;
declare const app: FirebaseApp;
export default app;
