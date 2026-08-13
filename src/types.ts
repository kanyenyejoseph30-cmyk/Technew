export type ProductCategory = 
  | 'Tous'
  | 'Robes'
  | 'Costumes & Vestes'
  | 'Chemises & Tops'
  | 'Manteaux & Abayas'
  | 'Chaussures'
  | 'Accessoires';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number; // En USD ou $
  compareAtPrice?: number;
  stock: number;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export type OrderStatus = 
  | 'en_attente'       // Commande enregistrée
  | 'validee'          // Paiement eMoney reçu
  | 'prise_en_charge'  // Colis pris en charge par le livreur
  | 'en_transit'       // Colis en cours d'acheminement
  | 'pret_retrait'     // Prêt pour retrait ou livraison finale
  | 'livree'           // Reçu par le client
  | 'annulee';

export type PaymentMethod = 'mpesa' | 'orange_money' | 'airtel_money';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  isCompleted: boolean;
}

export interface Order {
  id: string;
  trackingNumber: string; // ex: BE-2026-88492
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryType: 'domicile' | 'retrait_boutique';
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentPhone: string;
  paymentStatus: 'en_attente' | 'paye';
  transactionRef: string;
  status: OrderStatus;
  qrCodeDataUrl: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  trackingHistory: TrackingStep[];
  driverName?: string;
  driverPhone?: string;
  deliveryCoordinates?: { lat: number; lng: number };
}

export interface EMoneyConfig {
  merchantPhone: string; // Défaut: "0991018186"
  merchantName: string;
  mpesaActive: boolean;
  orangeActive: boolean;
  airtelActive: boolean;
}

export interface NotificationItem {
  id: string;
  orderId: string;
  title: string;
  message: string;
  type: 'sms' | 'email' | 'push';
  recipientPhone: string;
  timestamp: string;
  read: boolean;
}

export interface UserAccount {
  phone: string;
  name: string;
  email?: string;
  address?: string;
  role: 'client' | 'livreur' | 'gerant';
  isLoggedIn: boolean;
}

export interface DeliveryRouteAnalytic {
  zone: string;
  totalDeliveries: number;
  avgDeliveryTimeMinutes: number;
  satisfactionRate: number;
  recommendedDriver: string;
}
