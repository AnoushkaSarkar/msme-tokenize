import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "msme-token-platform.firebaseapp.com",
  projectId: "msme-token-platform",
  storageBucket: "msme-token-platform.appspot.com",
  messagingSenderId: "365941626704",
  appId: "1:365941626704:web:35d7ff885de6d55740fe55",
};

// ✅ Prevent re-initialization error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);