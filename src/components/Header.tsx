import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Sparkles, Truck, ShieldCheck, User, Bell, Wifi, WifiOff, Menu, X, Package, ChevronDown, LogIn, QrCode } from 'lucide-react';
import { NotificationItem } from '../types';

interface HeaderProps {
  currentTab: 'catalogue' | 'suivi' | 'client' | 'livreur' | 'gerant';
  setCurrentTab: (tab: 'catalogue' | 'suivi' | 'client' | 'livreur' | 'gerant') => void;
  cartCount: number;
  onOpenCart: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onSelectOrderForTracking?: (trackingNumber: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  onOpenCart,
  notifications,
  onMarkNotificationRead,
  onSelectOrderForTracking
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);
  const [showConnexionsMenu, setShowConnexionsMenu] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const connexionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close Connexions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (connexionsMenuRef.current && !connexionsMenuRef.current.contains(event.target as Node)) {
        setShowConnexionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isConnexionsActive = currentTab === 'client' || currentTab === 'livreur' || currentTab === 'gerant';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Maison Haute Couture <strong>Blanche Élégance</strong> — Paiements eMoney Sécurisés (M-Pesa, Orange, Airtel)</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            {isOnline ? (
              <span className="inline-flex items-center text-emerald-400">
                <Wifi className="w-3 h-3 mr-1" /> Synchronisation Live
              </span>
            ) : (
              <span className="inline-flex items-center text-amber-400">
                <WifiOff className="w-3 h-3 mr-1" /> Mode Hors-Ligne (Stocké localement)
              </span>
            )}
          </span>
          <span>Assistance: +243 99 101 81 86</span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentTab('catalogue'); setMobileMenuOpen(false); }}
            className="cursor-pointer group flex items-center gap-3"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-xl tracking-tighter border border-amber-400/40 shadow-sm group-hover:scale-105 transition-transform">
              BÉ
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-stone-900 block uppercase">
                Blanche Élégance
              </span>
              <span className="text-[10px] tracking-[0.25em] text-amber-700 font-medium uppercase block -mt-1">
                Haute Couture & Prêt-à-Porter
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-catalogue"
              onClick={() => setCurrentTab('catalogue')}
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-colors ${
                currentTab === 'catalogue'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Catalogue & Collections
            </button>

            <button
              id="nav-suivi"
              onClick={() => setCurrentTab('suivi')}
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'suivi'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Où est ma Commande ?</span>
            </button>

            {/* Connexions Dropdown Button */}
            <div className="relative" ref={connexionsMenuRef}>
              <button
                id="nav-connexions-btn"
                onClick={() => setShowConnexionsMenu(!showConnexionsMenu)}
                className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all flex items-center gap-2 border ${
                  isConnexionsActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : showConnexionsMenu
                    ? 'bg-stone-100 text-stone-950 border-stone-300'
                    : 'text-stone-700 border-stone-200 hover:text-stone-950 hover:bg-stone-50 hover:border-stone-300'
                }`}
                aria-expanded={showConnexionsMenu}
              >
                <LogIn className={`w-3.5 h-3.5 ${isConnexionsActive ? 'text-amber-400' : 'text-stone-500'}`} />
                <span className="font-semibold">Connexions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showConnexionsMenu ? 'rotate-180 text-amber-400' : 'text-stone-400'}`} />
              </button>

              {/* Dropdown Menu */}
              {showConnexionsMenu && (
                <div 
                  id="connexions-dropdown-menu"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 divide-y divide-stone-100"
                >
                  <div className="px-3.5 py-2 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Espaces & Authentifications
                  </div>

                  <div className="p-1 space-y-1">
                    {/* Item 1: Espace Client & Historique */}
                    <button
                      id="menu-espace-client"
                      onClick={() => {
                        setCurrentTab('client');
                        setShowConnexionsMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        currentTab === 'client'
                          ? 'bg-amber-50 text-amber-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <span className="block font-semibold">Espace Client & Historique</span>
                          <span className="text-[10px] text-stone-400 block font-normal">Commandes & QR Code</span>
                        </div>
                      </div>
                      {currentTab === 'client' && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </button>

                    {/* Item 2: Espace Livreur Express */}
                    <button
                      id="menu-espace-livreur"
                      onClick={() => {
                        setCurrentTab('livreur');
                        setShowConnexionsMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        currentTab === 'livreur'
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <Truck className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                          <span className="block font-semibold">Espace Livreur Express (Scanner QR)</span>
                          <span className="text-[10px] text-emerald-700 block font-normal">Scanner & Courses directes</span>
                        </div>
                      </div>
                      {currentTab === 'livreur' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>

                    {/* Item 3: Espace Gérant */}
                    <button
                      id="menu-espace-gerant"
                      onClick={() => {
                        setCurrentTab('gerant');
                        setShowConnexionsMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        currentTab === 'gerant'
                          ? 'bg-stone-900 text-amber-300 font-semibold'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block font-semibold">Espace Gérant (Accès 0991018186)</span>
                          <span className="text-[10px] text-stone-400 block font-normal">Stocks, Prix & Finances</span>
                        </div>
                      </div>
                      {currentTab === 'gerant' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Track Shortcut */}
            <button
              id="quick-track-btn"
              onClick={() => setCurrentTab('suivi')}
              title="Suivre un colis"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs border border-stone-300 rounded-full text-stone-700 hover:border-stone-900 hover:bg-stone-50 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span>Suivi QR</span>
            </button>

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                id="notif-dropdown-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-stone-900">Notifications de Commande</span>
                    <span className="text-xs text-stone-500">{notifications.length} message(s)</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-500">
                        Aucune notification pour le moment.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationRead(notif.id);
                            if (onSelectOrderForTracking) {
                              setShowNotifMenu(false);
                              setCurrentTab('suivi');
                            }
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-stone-50 transition-colors ${
                            !notif.read ? 'bg-amber-50/60 font-medium' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="text-stone-900 font-semibold">{notif.title}</span>
                            <span className="text-[10px] text-stone-400 whitespace-nowrap">{notif.timestamp}</span>
                          </div>
                          <p className="text-stone-600 leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-transform active:scale-95 flex items-center gap-2 shadow-xs"
              aria-label="Voir le Panier"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="hidden md:inline text-xs font-medium tracking-wide">Panier</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 lg:hidden"
              aria-label="Menu Mobile"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top">
          <button
            onClick={() => { setCurrentTab('catalogue'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentTab === 'catalogue' ? 'bg-stone-900 text-white' : 'text-stone-800 hover:bg-stone-100'
            }`}
          >
            Collections & Catalogue
          </button>
          <button
            onClick={() => { setCurrentTab('suivi'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
              currentTab === 'suivi' ? 'bg-amber-600 text-white' : 'text-stone-800 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            Où est votre Commande Blanche Élégance ?
          </button>

          {/* Connexions Mobile Section */}
          <div className="pt-2 border-t border-stone-100">
            <div className="px-2 pb-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-amber-600" />
              <span>Connexions & Espaces Dédiés</span>
            </div>

            <div className="space-y-1 mt-1 pl-1">
              <button
                onClick={() => { setCurrentTab('client'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
                  currentTab === 'client' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <User className="w-4 h-4 text-amber-500" />
                <span>Espace Client & Historique</span>
              </button>

              <button
                onClick={() => { setCurrentTab('livreur'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
                  currentTab === 'livreur' ? 'bg-emerald-800 text-white' : 'text-stone-700 hover:bg-emerald-50 text-emerald-950'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-500" />
                <span>Espace Livreur Express (Scanner QR)</span>
              </button>

              <button
                onClick={() => { setCurrentTab('gerant'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
                  currentTab === 'gerant' ? 'bg-stone-900 text-amber-300 border border-amber-400/40' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Espace Gérant (Accès 0991018186)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
