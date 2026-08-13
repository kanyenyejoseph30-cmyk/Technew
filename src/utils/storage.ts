import { Product, Order, EMoneyConfig, NotificationItem, DeliveryRouteAnalytic } from '../types';
import { INITIAL_PRODUCTS, INITIAL_EMONEY_CONFIG, INITIAL_SAMPLE_ORDERS, INITIAL_ANALYTICS } from '../data/initialData';
import { generateQrCodeUrl, buildOrderQrPayload } from './qrHelper';

const STORAGE_KEYS = {
  PRODUCTS: 'blanche_elegance_products_v1',
  ORDERS: 'blanche_elegance_orders_v1',
  EMONEY: 'blanche_elegance_emoney_v1',
  NOTIFICATIONS: 'blanche_elegance_notifications_v1',
  ANALYTICS: 'blanche_elegance_analytics_v1',
  CLIENT_PHONE: 'blanche_elegance_client_phone_v1',
  CART: 'blanche_elegance_cart_v1'
};

export async function getStoredProducts(): Promise<Product[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error', e);
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export async function getStoredOrders(): Promise<Order[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) {
      const parsed: Order[] = JSON.parse(raw);
      // Ensure all orders have valid QR Code
      for (const ord of parsed) {
        if (!ord.qrCodeDataUrl) {
          ord.qrCodeDataUrl = await generateQrCodeUrl(buildOrderQrPayload(ord.id, ord.trackingNumber, ord.customerPhone, ord.totalAmount));
        }
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Storage read error', e);
  }

  // Generate initial QR for sample orders
  const sampleWithQr = await Promise.all(
    INITIAL_SAMPLE_ORDERS.map(async (ord) => {
      const qr = await generateQrCodeUrl(buildOrderQrPayload(ord.id, ord.trackingNumber, ord.customerPhone, ord.totalAmount));
      return { ...ord, qrCodeDataUrl: qr };
    })
  );
  saveStoredOrders(sampleWithQr);
  return sampleWithQr;
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export function getStoredEMoneyConfig(): EMoneyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMONEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error', e);
  }
  return INITIAL_EMONEY_CONFIG;
}

export function saveStoredEMoneyConfig(config: EMoneyConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EMONEY, JSON.stringify(config));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error', e);
  }
  return [];
}

export function saveStoredNotifications(notifs: NotificationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export function getStoredAnalytics(): DeliveryRouteAnalytic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error', e);
  }
  return INITIAL_ANALYTICS;
}
