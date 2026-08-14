import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import rawFirebaseConfig from '../../firebase-applet-config.json';
import { Product, Order, EMoneyConfig } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_EMONEY_CONFIG } from '../data/initialData';

// Dynamic config supporting bundled configuration and Vercel/Vite environment variables
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || rawFirebaseConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || rawFirebaseConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || rawFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || rawFirebaseConfig.authDomain,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || rawFirebaseConfig.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || rawFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawFirebaseConfig.messagingSenderId,
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// Collection References
export const PRODUCTS_COLLECTION = 'products';
export const ORDERS_COLLECTION = 'orders';
export const SETTINGS_COLLECTION = 'settings';

/**
 * Seed initial data if database is empty
 */
export async function seedInitialFirestoreData() {
  try {
    // 1. Check & Seed Products
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnapshot.empty) {
      console.log('⚡ Initializing Firestore with default Blanche Élégance products...');
      const batch = writeBatch(db);
      for (const prod of INITIAL_PRODUCTS) {
        const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        batch.set(docRef, prod);
      }
      await batch.commit();
    }

    // 2. Check & Seed eMoney Config
    const configDocRef = doc(db, SETTINGS_COLLECTION, 'emoneyConfig');
    const configSnap = await getDoc(configDocRef);
    if (!configSnap.exists()) {
      console.log('⚡ Initializing Firestore settings...');
      await setDoc(configDocRef, DEFAULT_EMONEY_CONFIG);
    }
  } catch (err) {
    console.warn('Note on Firestore seeding (fallback to local if offline):', err);
  }
}

/**
 * Real-time listener for Products
 */
export function subscribeToProducts(callback: (products: Product[]) => void) {
  const q = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const prods: Product[] = [];
      snapshot.forEach((d) => {
        prods.push(d.data() as Product);
      });
      callback(prods);
    }
  }, (err) => {
    console.warn('Firestore Products listener error:', err);
  });
}

/**
 * Real-time listener for Orders
 */
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const q = collection(db, ORDERS_COLLECTION);
  return onSnapshot(q, (snapshot) => {
    const ords: Order[] = [];
    snapshot.forEach((d) => {
      ords.push(d.data() as Order);
    });
    // Sort by latest createdAt descending
    ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(ords);
  }, (err) => {
    console.warn('Firestore Orders listener error:', err);
  });
}

/**
 * Real-time listener for eMoney / Store Config
 */
export function subscribeToEMoneyConfig(callback: (config: EMoneyConfig) => void) {
  const configDocRef = doc(db, SETTINGS_COLLECTION, 'emoneyConfig');
  return onSnapshot(configDocRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as EMoneyConfig);
    }
  }, (err) => {
    console.warn('Firestore Settings listener error:', err);
  });
}

/**
 * Save / Update Single Product
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
  await setDoc(docRef, product, { merge: true });
}

/**
 * Bulk save Products
 */
export async function saveAllProductsToFirestore(products: Product[]): Promise<void> {
  const batch = writeBatch(db);
  for (const prod of products) {
    const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
    batch.set(docRef, prod, { merge: true });
  }
  await batch.commit();
}

/**
 * Delete Product
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
}

/**
 * Save New Order
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, order.id);
  await setDoc(docRef, order, { merge: true });
}

/**
 * Update Order (Status, Driver, etc.)
 */
export async function updateOrderInFirestore(orderId: string, updates: Partial<Order>): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, updates);
}

/**
 * Save eMoney Configuration
 */
export async function saveEMoneyConfigToFirestore(config: EMoneyConfig): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, 'emoneyConfig');
  await setDoc(docRef, config, { merge: true });
}
