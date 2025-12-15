import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBxXM494uFol57PV7g_rKagUmK4s92ZU4w",
    authDomain: "styliqo-f1b37.firebaseapp.com",
    projectId: "styliqo-f1b37",
    storageBucket: "styliqo-f1b37.firebasestorage.app",
    messagingSenderId: "646445354058",
    appId: "1:646445354058:web:421484e452aebfceeeaab3",
    measurementId: "G-ZBVC7MNQGT"
};

// Initialize variables
let app;
let auth;
let db;
let storage;
let analytics;

// Check if config is technically valid (has length)
// Removed the check that fails if the key matches the hardcoded one
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;

if (isConfigValid) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        analytics = getAnalytics(app);
    } catch (e) {
        console.error("Firebase Initialization Error:", e);
        // Fallback to mock on error
        auth = { currentUser: null };
        db = {};
        storage = {};
    }
} else {
    console.warn("Firebase Config missing or invalid. Using mock instances.");
    auth = { currentUser: null };
    db = {};
    storage = {};
}

// --- Auth Wrappers ---

export const loginUser = async (email, password) => {
    if (auth.currentUser === undefined || !isConfigValid) {
        // Mock Login
        console.log("Mock Login Success for:", email);
        return { user: { uid: "mock-user-123", email, displayName: "Test User" } };
    }
    return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email, password, fullName) => {
    if (auth.currentUser === undefined || !isConfigValid) {
        // Mock Register
        console.log("Mock Register Success for:", email);
        return { user: { uid: "mock-new-user-456", email, displayName: fullName } };
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: fullName });
    return userCredential;
};

export const logoutUser = async () => {
    if (auth.currentUser === undefined || !isConfigValid) return Promise.resolve();
    return signOut(auth);
};

export const observeAuthState = (callback) => {
    if (auth.currentUser === undefined || !isConfigValid) {
        callback(null);
        return () => { };
    }
    return onAuthStateChanged(auth, callback);
};

// --- Firestore Wrappers ---

export const getProducts = (callback, onError) => {
    if (!db || !db.app) { // Check if 'db' is a real Firestore instance
        console.warn("Firestore not connected. Returning empty list.");
        if (callback) callback([]); // Return empty list
        return () => { };
    }
    return onSnapshot(collection(db, "products"),
        (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, originalId: doc.data().id }));
            if (callback) callback(data);
        },
        (error) => {
            console.error("Firestore Error:", error);
            if (onError) onError(error);
        }
    );
};

export const addProduct = async (productData) => {
    if (!db || !db.app) throw new Error("Database not connected (Mock Mode)");
    return addDoc(collection(db, "products"), {
        ...productData,
        createdAt: new Date()
    });
};

export const updateProduct = async (id, productData) => {
    if (!db || !db.app) throw new Error("Database not connected (Mock Mode)");
    return updateDoc(doc(db, "products", id), productData);
};

export const deleteProduct = async (id) => {
    if (!db || !db.app) throw new Error("Database not connected (Mock Mode)");
    return deleteDoc(doc(db, "products", id));
};

export const getProduct = async (id) => {
    if (!db || !db.app) throw new Error("Database not connected (Mock Mode)");
    const snap = await getDoc(doc(db, "products", id));
    if (snap.exists()) return snap.data();
    return null;
};

// --- Order Wrappers ---

export const addOrder = async (orderData) => {
    if (!db || !db.app) throw new Error("Database not connected (Mock Mode)");
    return addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: new Date()
    });
};

export const getOrders = (callback, onError) => {
    if (!db || !db.app) {
        console.warn("Firestore not connected. Returning empty list.");
        if (callback) callback([]);
        return () => { };
    }
    return onSnapshot(collection(db, "orders"),
        (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            if (callback) callback(data);
        },
        (error) => {
            console.error("Firestore Error (Orders):", error);
            if (onError) onError(error);
        }
    );
};

export const updateOrderStatus = async (orderId, status) => {
    if (!db || !db.app) throw new Error("Database not connected (Mock Mode)");
    return updateDoc(doc(db, "orders", orderId), { status });
};

// --- Storage Wrappers ---

export const uploadImage = async (file) => {
    if (!storage || !storage.app) throw new Error("Storage not connected (Mock Mode)");

    // Create a unique filename
    const filename = `product-images/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

export { auth, db, storage };
