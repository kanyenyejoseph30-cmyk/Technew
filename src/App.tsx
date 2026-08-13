import React, { useState, useEffect } from 'react';
import { Product, Order, CartItem, EMoneyConfig, NotificationItem, DeliveryRouteAnalytic, OrderStatus, ProductCategory } from './types';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredOrders, 
  saveStoredOrders, 
  getStoredEMoneyConfig, 
  saveStoredEMoneyConfig, 
  getStoredNotifications, 
  saveStoredNotifications, 
  getStoredAnalytics 
} from './utils/storage';
import { createOrderNotification, requestBrowserNotificationPermission } from './utils/notifications';

// Components
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { QrScannerModal } from './components/QrScannerModal';
import { ClientSpace } from './components/ClientSpace';
import { DeliveryDriverSpace } from './components/DeliveryDriverSpace';
import { AdminManagerSpace } from './components/AdminManagerSpace';
import { ReceiptModal } from './components/ReceiptModal';

import { Sparkles, ShieldCheck, Truck, Smartphone, QrCode, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'catalogue' | 'suivi' | 'client' | 'livreur' | 'gerant'>('catalogue');
  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState<string>('');

  // Core Data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [emoneyConfig, setEmoneyConfig] = useState<EMoneyConfig>(getStoredEMoneyConfig());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [analytics, setAnalytics] = useState<DeliveryRouteAnalytic[]>(getStoredAnalytics());

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('blanche_elegance_cart_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Initial load
  useEffect(() => {
    async function loadData() {
      const prods = await getStoredProducts();
      setProducts(prods);

      const ords = await getStoredOrders();
      setOrders(ords);

      const notifs = getStoredNotifications();
      setNotifications(notifs);

      // Request Web Push permission on first turn
      requestBrowserNotificationPermission();
    }
    loadData();
  }, []);

  // Save Cart
  useEffect(() => {
    try {
      localStorage.setItem('blanche_elegance_cart_v1', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Cart save error', e);
    }
  }, [cartItems]);

  // Handler: Add to Cart
  const handleAddToCart = (product: Product, quantity: number, size: string, color: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIdx].quantity + quantity);
        updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
        return updated;
      }
      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, 1, product.sizes[0] || 'Standard', product.colors[0] || 'Blanc');
  };

  const handleUpdateCartQuantity = (productId: string, size: string, color: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId, size, color);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (productId: string, size: string, color: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handler: Order Creation
  const handleOrderCreated = (newOrder: Order) => {
    // 1. Decrease product stock in real time
    setProducts(prev => {
      const updated = prev.map(p => {
        const cartItem = newOrder.items.find(i => i.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      });
      saveStoredProducts(updated);
      return updated;
    });

    // 2. Add to Orders
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // 3. Clear cart
    setCartItems([]);

    // 4. Generate notification
    const notif = createOrderNotification(newOrder, newOrder.status);
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);

    // 5. Navigate to tracking view
    setSelectedTrackingNumber(newOrder.trackingNumber);
    setCurrentTab('suivi');
  };

  // Handler: Update Order Status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        const nowReadable = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        const updatedHistory = ord.trackingHistory.map(step => {
          if (step.status === newStatus) {
            return { ...step, isCompleted: true, timestamp: nowReadable };
          }
          return step;
        });

        const updatedOrd: Order = {
          ...ord,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          trackingHistory: updatedHistory
        };

        // Trigger reactive notification
        const notif = createOrderNotification(updatedOrd, newStatus);
        const updatedNotifs = [notif, ...notifications];
        setNotifications(updatedNotifs);
        saveStoredNotifications(updatedNotifs);

        return updatedOrd;
      }
      return ord;
    });

    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
  };

  // Handler: Scan QR Code Action
  const handleOrderScanned = (order: Order, actionType: 'prise_en_charge' | 'remise_livree') => {
    const targetStatus: OrderStatus = actionType === 'prise_en_charge' ? 'prise_en_charge' : 'livree';
    handleUpdateOrderStatus(order.id, targetStatus);
    setSelectedTrackingNumber(order.trackingNumber);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col justify-between font-sans antialiased selection:bg-amber-400 selection:text-stone-950">
      
      {/* 1. Header Navigation Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onSelectOrderForTracking={(trackNo) => {
          setSelectedTrackingNumber(trackNo);
          setCurrentTab('suivi');
        }}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: CATALOGUE */}
        {currentTab === 'catalogue' && (
          <div>
            <HeroBanner
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onTrackClick={() => setCurrentTab('suivi')}
            />

            <ProductCatalog
              products={products}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onOpenDetail={(prod) => setDetailProduct(prod)}
              onQuickAdd={handleQuickAdd}
            />
          </div>
        )}

        {/* VIEW 2: SUIVI EN DIRECT (Où est votre commande & QR Code) */}
        {currentTab === 'suivi' && (
          <OrderTrackingView
            orders={orders}
            selectedTrackingNumber={selectedTrackingNumber}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenReceipt={(ord) => setReceiptOrder(ord)}
          />
        )}

        {/* VIEW 3: ESPACE CLIENT */}
        {currentTab === 'client' && (
          <ClientSpace
            orders={orders}
            onSelectOrderToTrack={(trackNo) => {
              setSelectedTrackingNumber(trackNo);
              setCurrentTab('suivi');
            }}
            onOpenReceipt={(ord) => setReceiptOrder(ord)}
          />
        )}

        {/* VIEW 4: ESPACE LIVREUR EXPRESS */}
        {currentTab === 'livreur' && (
          <DeliveryDriverSpace
            orders={orders}
            onOpenScanner={() => setIsScannerOpen(true)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* VIEW 5: ESPACE GÉRANT & ADMINISTRATION (Accès 0991018186) */}
        {currentTab === 'gerant' && (
          <AdminManagerSpace
            products={products}
            orders={orders}
            emoneyConfig={emoneyConfig}
            analytics={analytics}
            onSaveProducts={(prods) => {
              setProducts(prods);
              saveStoredProducts(prods);
            }}
            onSaveOrders={(ords) => {
              setOrders(ords);
              saveStoredOrders(ords);
            }}
            onSaveEMoneyConfig={(cfg) => {
              setEmoneyConfig(cfg);
              saveStoredEMoneyConfig(cfg);
            }}
            onOpenReceipt={(ord) => setReceiptOrder(ord)}
          />
        )}

      </main>

      {/* 3. Luxury Haute Couture Footer */}
      <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-serif font-bold text-sm flex items-center justify-center">
                  BÉ
                </div>
                <span className="font-serif text-lg font-bold text-white tracking-widest uppercase">
                  Blanche Élégance
                </span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed font-light">
                Maison de haute couture et prêt-à-porter exclusif. Une signature d'exception alliant tissus nobles et technologies modernes de livraison suivie.
              </p>
              <div className="pt-2 text-stone-300 flex items-center gap-1.5 font-mono text-xs">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Transactions & Support : <strong>{emoneyConfig.merchantPhone}</strong></span>
              </div>
            </div>

            {/* Col 2: Services eMoney */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-stone-100 uppercase tracking-wider">
                Paiements Mobiles eMoney
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Vodacom M-Pesa (*1122#)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Orange Money (*144#)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>Airtel Money (*501#)</span>
                </li>
                <li className="text-[11px] text-amber-400/90 pt-1">
                  Numéro Marchand : {emoneyConfig.merchantPhone}
                </li>
              </ul>
            </div>

            {/* Col 3: Navigation rapide */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-stone-100 uppercase tracking-wider">
                Navigation Rapide
              </h4>
              <ul className="space-y-1.5 text-stone-400">
                <li>
                  <button onClick={() => setCurrentTab('catalogue')} className="hover:text-amber-400 transition">
                    Catalogue Vêtements & Robes
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('suivi')} className="hover:text-amber-400 transition">
                    Où est votre commande ? (Suivi Live)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('client')} className="hover:text-amber-400 transition">
                    Espace Client & Historique
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('livreur')} className="hover:text-amber-400 transition">
                    Espace Livreur Express (Scanner QR)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('gerant')} className="hover:text-amber-400 transition">
                    Espace Gérant (Accès 0991018186)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Boutique & Horaires */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-stone-100 uppercase tracking-wider">
                Boutique & Atelier
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Avenue de la Justice, Immeuble Horizon<br />
                Commune de la Gombe, Kinshasa, RDC
              </p>
              <p className="text-stone-400 text-xs">
                Lundi – Samedi : 08h30 – 19h00<br />
                Dimanche : Retrait sur rendez-vous
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>QR Code de certification infalsifiable</span>
              </div>
            </div>

          </div>

          <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>
              © 2026 Blanche Élégance SARL. Tous droits réservés.
            </div>
            <div className="flex items-center gap-4">
              <span>Authentification Sécurisée</span>
              <span>•</span>
              <span>Gestion des Stocks en Temps Réel</span>
              <span>•</span>
              <span>Paiement eMoney</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. MODALS & DRAWERS */}
      
      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          key={detailProduct.id}
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onProceedToCheckout={() => setIsCheckoutOpen(true)}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cartItems}
          emoneyConfig={emoneyConfig}
          onOrderCreated={handleOrderCreated}
        />
      )}

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <QrScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          orders={orders}
          onOrderScanned={handleOrderScanned}
        />
      )}

      {/* Receipt Modal */}
      {receiptOrder && (
        <ReceiptModal
          key={receiptOrder.id}
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}

    </div>
  );
}
