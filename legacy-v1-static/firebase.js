import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_N1xjjA1b31lFDsPf4pcIoPNuSSu0_lI",
  authDomain: "alima-cms-8138.firebaseapp.com",
  projectId: "alima-cms-8138",
  storageBucket: "alima-cms-8138.firebasestorage.app",
  messagingSenderId: "1023415028391",
  appId: "1:1023415028391:web:f9e1f19a70f327cd696982"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Bind to window for global access across vanilla JS scripts
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
window.googleProvider = googleProvider;
