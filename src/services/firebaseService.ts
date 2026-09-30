import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { CollectionItem, Product, StoreSettings } from '../types/store';
import { FIREBASE_CONFIG, isFirebaseConfigured } from './firebaseConfig';

let dbInstance: ReturnType<typeof getFirestore> | null = null;

export function getFirestoreDb() {
  if (!isFirebaseConfigured()) return null;
  if (!dbInstance) {
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
      dbInstance = FIREBASE_CONFIG.firestoreDatabaseId
        ? getFirestore(app, FIREBASE_CONFIG.firestoreDatabaseId)
        : getFirestore(app);
    } catch (err) {
      console.error('Failed to initialize Firestore:', err);
      return null;
    }
  }
  return dbInstance;
}

const COLLECTIONS_TABLE = 'store_collections';
const PRODUCTS_TABLE = 'store_products';
const SETTINGS_TABLE = 'store_settings';
const GLOBAL_SETTINGS_DOC = 'global';

/**
 * Seed initial catalog to Firestore if the cloud collections are empty
 */
export async function seedCloudDataIfEmpty(
  defaultCollections: CollectionItem[],
  defaultProducts: Product[],
  defaultSettings: StoreSettings
) {
  const db = getFirestoreDb();
  if (!db) return;

  try {
    const colSnap = await getDocs(collection(db, COLLECTIONS_TABLE));
    if (colSnap.empty) {
      console.log('Seeding initial collections to Firestore Cloud...');
      for (const col of defaultCollections) {
        await setDoc(doc(db, COLLECTIONS_TABLE, col.id), col);
      }
    }

    const prodSnap = await getDocs(collection(db, PRODUCTS_TABLE));
    if (prodSnap.empty) {
      console.log('Seeding initial products to Firestore Cloud...');
      for (const prod of defaultProducts) {
        await setDoc(doc(db, PRODUCTS_TABLE, prod.id), prod);
      }
    }

    const settingsRef = doc(db, SETTINGS_TABLE, GLOBAL_SETTINGS_DOC);
    await setDoc(settingsRef, defaultSettings, { merge: true });
  } catch (err) {
    console.error('Error seeding initial Firestore data:', err);
  }
}

/**
 * Subscribe to collections in real time
 */
export function subscribeCloudCollections(
  onUpdate: (collections: CollectionItem[]) => void
) {
  const db = getFirestoreDb();
  if (!db) return () => {};

  const colRef = collection(db, COLLECTIONS_TABLE);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const cloudCols: CollectionItem[] = [];
        snapshot.forEach((d) => {
          cloudCols.push({ id: d.id, ...d.data() } as CollectionItem);
        });
        onUpdate(cloudCols);
      }
    },
    (err) => {
      console.error('Cloud collections snapshot error:', err);
    }
  );
}

/**
 * Subscribe to products in real time
 */
export function subscribeCloudProducts(
  onUpdate: (products: Product[]) => void
) {
  const db = getFirestoreDb();
  if (!db) return () => {};

  const prodRef = collection(db, PRODUCTS_TABLE);
  return onSnapshot(
    prodRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const cloudProds: Product[] = [];
        snapshot.forEach((d) => {
          cloudProds.push({ id: d.id, ...d.data() } as Product);
        });
        onUpdate(cloudProds);
      }
    },
    (err) => {
      console.error('Cloud products snapshot error:', err);
    }
  );
}

/**
 * Subscribe to global store settings in real time
 */
export function subscribeCloudSettings(
  onUpdate: (settings: Partial<StoreSettings>) => void
) {
  const db = getFirestoreDb();
  if (!db) return () => {};

  const settingsRef = doc(db, SETTINGS_TABLE, GLOBAL_SETTINGS_DOC);
  return onSnapshot(
    settingsRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as Partial<StoreSettings>);
      }
    },
    (err) => {
      console.error('Cloud settings snapshot error:', err);
    }
  );
}

/**
 * Save / Update a single collection to Cloud Firestore
 */
export async function syncCollectionToCloud(
  collectionId: string,
  data: Partial<CollectionItem>
) {
  const db = getFirestoreDb();
  if (!db) return;
  try {
    const docRef = doc(db, COLLECTIONS_TABLE, collectionId);
    await setDoc(docRef, { ...data, id: collectionId }, { merge: true });
  } catch (err) {
    console.error('Failed to sync collection to cloud:', err);
  }
}

/**
 * Delete a collection from Cloud Firestore
 */
export async function deleteCollectionFromCloud(collectionId: string) {
  const db = getFirestoreDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS_TABLE, collectionId));
  } catch (err) {
    console.error('Failed to delete collection from cloud:', err);
  }
}

/**
 * Save / Update a product to Cloud Firestore
 */
export async function syncProductToCloud(
  productId: string,
  data: Partial<Product>
) {
  const db = getFirestoreDb();
  if (!db) return;
  try {
    const docRef = doc(db, PRODUCTS_TABLE, productId);
    await setDoc(docRef, { ...data, id: productId }, { merge: true });
  } catch (err) {
    console.error('Failed to sync product to cloud:', err);
  }
}

/**
 * Delete a product from Cloud Firestore
 */
export async function deleteProductFromCloud(productId: string) {
  const db = getFirestoreDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, PRODUCTS_TABLE, productId));
  } catch (err) {
    console.error('Failed to delete product from cloud:', err);
  }
}

/**
 * Save / Update settings to Cloud Firestore
 */
export async function syncSettingsToCloud(data: Partial<StoreSettings>) {
  const db = getFirestoreDb();
  if (!db) return;
  try {
    const docRef = doc(db, SETTINGS_TABLE, GLOBAL_SETTINGS_DOC);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.error('Failed to sync settings to cloud:', err);
  }
}
