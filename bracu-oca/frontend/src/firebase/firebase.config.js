import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const devAuthEnabled = import.meta.env.VITE_DEV_AUTH === '1' || import.meta.env.VITE_DEV_AUTH === 'true';

let auth = null;

if (!devAuthEnabled) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID
  };

  // Only initialize if a minimal config exists
  if (firebaseConfig.apiKey && firebaseConfig.authDomain) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
}

export default auth;