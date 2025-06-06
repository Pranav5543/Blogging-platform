
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, type Analytics } from "firebase/analytics";

// User-provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlHAbjCAmiBsCnSROTBlqUtEaWXAEPq5Y",
  authDomain: "launchmytech-bc399.firebaseapp.com",
  projectId: "launchmytech-bc399",
  storageBucket: "launchmytech-bc399.firebasestorage.app",
  messagingSenderId: "560089059394",
  appId: "1:560089059394:web:443490c3f37e365a445ddb",
  measurementId: "G-Z2HGHVP6ER"
};

// Validate essential Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing or incomplete in src/lib/firebase.ts. Please ensure all required fields are present.");
}

let app: FirebaseApp;
let analyticsInstance: Analytics | undefined; // Renamed to avoid conflict with getAnalytics import

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      try {
        analyticsInstance = getAnalytics(app);
      } catch (e) {
        console.warn("Could not initialize Firebase Analytics:", e);
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // For now, we'll let it proceed so the error page can render, but log it.
    // In a real app, you might want to throw the error or handle it more gracefully.
  }
} else {
  app = getApp();
  if (typeof window !== 'undefined' && firebaseConfig.measurementId && app) { 
    try {
      analyticsInstance = getAnalytics(app);
    } catch (e) {
      console.warn("Could not initialize Firebase Analytics on existing app instance:", e);
    }
  }
}

// @ts-ignore - app might be undefined if initialization fails critically, though unlikely with hardcoded config
const auth = app ? getAuth(app) : null;

if (!auth && app) { // Check app as well, since getAuth depends on it
    console.error("Firebase Auth could not be initialized. This will prevent login functionality.");
}

export { app, auth, analyticsInstance as analytics };
