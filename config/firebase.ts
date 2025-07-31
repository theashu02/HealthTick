import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

    apiKey: "AIzaSyD8S0BZuDacRYU2h_1a7XtZDkoEzRgyYx0",
  
    authDomain: "simplxhealth-47d54.firebaseapp.com",
  
    projectId: "simplxhealth-47d54",
  
    storageBucket: "simplxhealth-47d54.firebasestorage.app",
  
    messagingSenderId: "96735634403",
  
    appId: "1:96735634403:web:b82595b4caff7b38bdb6d6",
  
    measurementId: "G-CRG79DBCGF"
  
};
  

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/calendar.events');

export { app, auth, db, provider };