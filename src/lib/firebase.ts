
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlHAbjCAmiBsCnSROTBlqUtEaWXAEPq5Y",
  authDomain: "launchmytech-bc399.firebaseapp.com",
  projectId: "launchmytech-bc399",
  storageBucket: "launchmytech-bc399.firebasestorage.app",
  messagingSenderId: "560089059394",
  appId: "1:560089059394:web:443490c3f37e365a445ddb",
  measurementId: "G-Z2HGHVP6ER"
};

let app: FirebaseApp;
let analytics: Analytics | undefined;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} else {
  app = getApp();
  if (typeof window !== 'undefined') {
    // Ensure analytics is initialized for the existing app instance if not already
    // This might not be strictly necessary if getAnalytics(app) is idempotent or handles this.
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Could not initialize Analytics on existing app instance:", e);
    }
  }
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, analytics };
