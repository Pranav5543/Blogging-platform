
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Read environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// Diagnostic log: This will print to the server console during build/SSR and browser console on client side.
console.log("Firebase Init: Attempting to use API Key from env:", apiKey);
if (!apiKey) {
  console.error("Firebase Init Error: NEXT_PUBLIC_FIREBASE_API_KEY is undefined or empty. Ensure it is set in your .env.local file and the server is restarted.");
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

// Validate essential Firebase config - this was already here but good to keep
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing or incomplete. Check your environment variables (e.g., .env.local) and ensure the Next.js server was restarted after changes.");
}


let app: FirebaseApp;
let analytics: Analytics | undefined;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn("Could not initialize Firebase Analytics:", e);
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Rethrow or handle critical failure, as the app might not function without Firebase
    // For now, we'll let it proceed so the error page can render, but log it.
  }
} else {
  app = getApp();
  if (typeof window !== 'undefined' && firebaseConfig.measurementId && app) { // Check if app exists
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Could not initialize Firebase Analytics on existing app instance:", e);
    }
  }
}

// @ts-ignore
const auth = app ? getAuth(app) : null; // Ensure app is initialized before calling getAuth

if (!auth && app) {
    console.error("Firebase Auth could not be initialized. This will prevent login functionality.");
}


export { app, auth, analytics };
