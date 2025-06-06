
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration (Hardcoded as per user request)
const firebaseConfig = {
  apiKey: "AIzaSyBlHAbjCAmiBsCnSROTBlqUtEaWXAEPq5Y",
  authDomain: "launchmytech-bc399.firebaseapp.com",
  projectId: "launchmytech-bc399",
  storageBucket: "launchmytech-bc399.firebasestorage.app", // Consider "launchmytech-bc399.appspot.com" if this is incorrect
  messagingSenderId: "560089059394",
  appId: "1:560089059394:web:443490c3f37e365a445ddb",
  measurementId: "G-Z2HGHVP6ER"
};

let app: FirebaseApp | undefined = undefined;
let analyticsInstance: Analytics | undefined = undefined;
let authInstance: Auth | null = null;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app); // Initialize auth if app is initialized
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      try {
        analyticsInstance = getAnalytics(app);
      } catch (e) {
        console.warn("Could not initialize Firebase Analytics:", e);
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // app will remain undefined, authInstance will remain null
  }
} else {
  app = getApp(); // This should always return an initialized app if getApps().length > 0
  authInstance = getAuth(app); // Initialize auth
  if (typeof window !== 'undefined' && firebaseConfig.measurementId && app) { 
    try {
      analyticsInstance = getAnalytics(app);
    } catch (e) {
      console.warn("Could not initialize Firebase Analytics on existing app instance:", e);
    }
  }
}

if (!app) {
    console.error("Firebase App could not be initialized. Firebase services will be unavailable.");
} else if (!authInstance) {
    // This case should be rare if app is initialized, as getAuth would likely throw if app is invalid
    console.error("Firebase App was initialized, but Auth could not be. Login functionality will be affected.");
}

export { app, authInstance as auth, analyticsInstance as analytics };
