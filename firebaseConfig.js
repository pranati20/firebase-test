import { initializeApp, getApps, getApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';  
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD3qMND2hVDs0nVVcoX5JlIWZrJcWE03Zc",
  authDomain: "turfpass-b97a9.firebaseapp.com",
  projectId: "turfpass-b97a9",
  storageBucket: "turfpass-b97a9.appspot.com",
  messagingSenderId: "1088147165433",
  appId: "1:1088147165433:web:fa447740334d1b38939228",
  measurementId: "G-KGCCR993WB",
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, db, storage, firebaseConfig };
