// import { initializeApp, getApps, getApp } from '@firebase/app';
// import { getAuth } from '@firebase/auth';  
// import { getFirestore } from '@firebase/firestore';
// import { getStorage } from '@firebase/storage';

// // Your Firebase configuration object
// const firebaseConfig = {
//   apiKey: "AIzaSyD3qMND2hVDs0nVVcoX5JlIWZrJcWE03Zc",
//   authDomain: "turfpass-b97a9.firebaseapp.com",
//   projectId: "turfpass-b97a9",
//   storageBucket: "turfpass-b97a9.appspot.com",
//   messagingSenderId: "1088147165433",
//   appId: "1:1088147165433:web:fa447740334d1b38939228",
//   measurementId: "G-KGCCR993WB",
// };

// // Initialize Firebase
// const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(firebaseApp);
// const db = getFirestore(firebaseApp);
// const storage = getStorage(firebaseApp);

// export { firebaseApp, auth, db, storage, firebaseConfig };



import { initializeApp, getApps, getApp } from 'firebase/app';  // Correct import for Firebase app
import { getAuth } from 'firebase/auth';  // Correct import for Firebase auth
import { getFirestore } from 'firebase/firestore';  // Correct import for Firestore
import { getStorage } from 'firebase/storage';  // Correct import for Firebase Storage

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "a",
  appId: "1:1088147165433:web:fa44sas7740334d1b38939228",
  measurementId: "G-KGCCR99asa3WB",
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(firebaseApp);  // Use the initialized firebaseApp
const db = getFirestore(firebaseApp);  // Use the initialized firebaseApp
const storage = getStorage(firebaseApp);  // Use the initialized firebaseApp

export { firebaseApp, auth, db, storage, firebaseConfig };
