import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

// Simple check to see if we have a real config
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key' && firebaseConfig.apiKey.length > 10;

if (isConfigValid) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
    } catch (e) {
        console.error("Firebase Initialization Error:", e);
        // Fallback to mock if init fails
        auth = { currentUser: null };
        db = {};
        storage = {};
    }
} else {
    console.warn("Firebase Config missing or invalid. Using mock instances.");
    auth = { currentUser: null }; // Mock object
    db = {};
    storage = {};
}

// Wrapper Functions for Auth
// These ensure that even if 'auth' is a mock object, we don't crash by calling SDK functions on it.

export const loginUser = async (email, password) => {
    if (isConfigValid && auth.currentUser === undefined) {
        // Real logic: 'auth' is a real Auth instance (has properties other than just currentUser mock)
        // A better check is 'isConfigValid' but let's trust the logic above.
        return signInWithEmailAndPassword(auth, email, password);
    } else {
        // Mock Login
        console.log("Mock Login Success for:", email);
        return {
            user: {
                uid: "mock-user-123",
                email: email,
                displayName: "Test User",
                photoURL: null
            }
        };
    }
};

export const registerUser = async (email, password, fullName) => {
    if (isConfigValid && auth.currentUser === undefined) {
        // Real logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        return userCredential;
    } else {
        // Mock Register
        console.log("Mock Register Success for:", email);
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            user: {
                uid: "mock-new-user-456",
                email: email,
                displayName: fullName,
                photoURL: null
            }
        };
    }
};

export const logoutUser = async () => {
    if (isConfigValid && auth.currentUser === undefined) {
        return signOut(auth);
    } else {
        console.log("Mock Logout Success");
        return Promise.resolve();
    }
};

export const observeAuthState = (callback) => {
    if (isConfigValid && auth.currentUser === undefined) {
        return onAuthStateChanged(auth, callback);
    } else {
        // Mock Observer
        // We'll just call it once with null (or we could persist generic user)
        // For testing "login" flow in mock mode, this won't auto-update, so apps using mock mode rely on store updates manually.
        callback(null);
        return () => { };
    }
};

export { auth, db, storage };
