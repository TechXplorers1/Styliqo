import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, getDoc, query, where, orderBy, getDocs } from "firebase/firestore";
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

    // Store user in Firestore
    try {
        await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            displayName: fullName,
            email: email,
            role: 'user', // Default role
            createdAt: new Date()
        });
    } catch (e) {
        console.error("Error storing user details:", e);
        // Continue even if storing details fails, auth is successful
    }

    return userCredential;
};

export const getUsers = (callback, onError) => {
    if (!db || !db.app) {
        if (callback) callback([]);
        return () => { };
    }
    return onSnapshot(collection(db, "users"),
        (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            if (callback) callback(data);
        },
        (error) => {
            console.error("Firestore Error (Users):", error);
            if (onError) onError(error);
        }
    );
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

    try {
        console.log("Adding order to Firestore:", orderData);
        const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            // Only add createdAt if not already provided
            createdAt: orderData.createdAt || new Date().toISOString()
        });
        console.log("Order added successfully with ID:", docRef.id);
        return docRef;
    } catch (error) {
        console.error("Error adding order to Firestore:", error);
        throw error;
    }
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

export const getUserOrders = (userId, callback, onError) => {
    if (!db || !db.app) {
        if (callback) callback([]);
        if (onError) onError(new Error("Database not connected"));
        return () => { };
    }
    // Removed orderBy to avoid index requirement - orders will be sorted client-side
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    return onSnapshot(q,
        (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Sort client-side by createdAt descending
            data.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA; // Descending order (newest first)
            });
            if (callback) callback(data);
        },
        (error) => {
            console.error("Firestore Error (User Orders):", error);
            if (onError) onError(error);
        }
    );
};

// --- Address Wrappers ---

export const addUserAddress = async (userId, addressData) => {
    if (!db || !db.app) throw new Error("Database not connected (Mock Mode)");
    // Add to a subcollection 'addresses' under the user document
    return addDoc(collection(db, "users", userId, "addresses"), {
        ...addressData,
        createdAt: new Date()
    });
};

export const getUserAddresses = (userId, callback, onError) => {
    if (!db || !db.app) {
        if (callback) callback([]);
        if (onError) onError(new Error("Database not connected"));
        return () => { };
    }
    const q = query(collection(db, "users", userId, "addresses"), orderBy("createdAt", "desc"));
    return onSnapshot(q,
        (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            if (callback) callback(data);
        },
        (error) => {
            console.error("Firestore Error (Addresses):", error);
            if (onError) onError(error);
        }
    );
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

// Cleanup function to delete Sarees and Kurtis
export const deleteSareesAndKurtis = async () => {
    if (!db || !db.app) {
        console.error("Database not connected");
        return { success: false, error: "Database not connected" };
    }

    try {
        console.log('Starting cleanup: Deleting Sarees and Kurtis from Firestore...');

        const productsRef = collection(db, 'products');

        // Query for Sarees
        const sareesQuery = query(productsRef, where('category', '==', 'Sarees'));
        const sareesSnapshot = await getDocs(sareesQuery);

        // Query for Kurtis
        const kurtisQuery = query(productsRef, where('category', '==', 'Kurtis'));
        const kurtisSnapshot = await getDocs(kurtisQuery);

        let deletedCount = 0;

        // Delete Sarees
        for (const docSnapshot of sareesSnapshot.docs) {
            await deleteDoc(doc(db, 'products', docSnapshot.id));
            deletedCount++;
            console.log(`Deleted Saree: ${docSnapshot.data().title}`);
        }

        // Delete Kurtis
        for (const docSnapshot of kurtisSnapshot.docs) {
            await deleteDoc(doc(db, 'products', docSnapshot.id));
            deletedCount++;
            console.log(`Deleted Kurti: ${docSnapshot.data().title}`);
        }

        console.log(`✅ Cleanup complete! Deleted ${deletedCount} products.`);
        return { success: true, deletedCount };

    } catch (error) {
        console.error('Error during cleanup:', error);
        return { success: false, error: error.message };
    }
};

export { auth, db, storage };
