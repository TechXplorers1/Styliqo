// Firestore Cleanup Script - Delete Sarees and Kurtis
// Run this once from browser console or as a one-time admin action

import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

export const deleteSareesAndKurtis = async () => {
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

// To run this script, import it in your admin dashboard and call:
// deleteSareesAndKurtis().then(result => console.log(result));
