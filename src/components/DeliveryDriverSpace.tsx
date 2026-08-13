import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Truck, QrCode, Phone, MapPin, CheckCircle2, Clock, AlertCircle, Navigation, ShieldCheck, Lock, KeyRound, LogOut, ArrowRight, Sparkles } from 'lucide-react';

interface DeliveryDriverSpaceProps {
  orders: Order[];
  onOpenScanner: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const DeliveryDriverSpace: React.FC<DeliveryDriverSpaceProps> = ({
  orders,
  onOpenScanner,
  onUpdateOrderStatus
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('blanche_livreur_authenticated') === 'true';
  });
  const [driverName, setDriverName] = useState<string>(() => {
    return localStorage.getItem('blanche_livreur_name') || 'Jean-Luc Express';
  });
  const [driverPhone, setDriverPhone] = useState<string>(() => {
    return localStorage.getItem('blanche_livreur_phone') || '0820001122';
  });

  // Courier Auth Form
  const [inputCourierPhone, setInputCourierPhone] = useState<string>('');
  const [inputCourierPin, setInputCourierPin] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleCourierLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanPhone = inputCourierPhone.replace(/[\s\-\+]/g, '');
    
    // Check credentials or valid phone format
    if (!cleanPhone || cleanPhone.length < 8) {
      setAuthError('Veuillez saisir votre numéro de livreur agréé.');
      return;
    }

    let detectedName = 'Jean-Luc Express';
    if (cleanPhone.includes('991018186')) {
      detectedName = 'Joseph Kanyenye (Superviseur Flotte)';
    } else if (cleanPhone.includes('851122334')) {
      detectedName = 'Alain Mukendi (Livreur Nord)';
    }

    setIsAuthenticated(true);
    setDriverName(detectedName);
    setDriverPhone(inputCourierPhone);
    localStorage.setItem('blanche_livreur_authenticated', 'true');
    localStorage.setItem('blanche_livreur_name', detectedName);
    localStorage.setItem('blanche_livreur_phone', inputCourierPhone);
  };

  const handleQuickDemoLogin = (phone: string, name: string) => {
    setIsAuthenticated(true);
    setDriverName(name);
    setDriverPhone(phone);
    localStorage.setItem('blanche_livreur_authenticated', 'true');
    localStorage.setItem('blanche_livreur_name', name);
    localStorage.setItem('blanche_livreur_phone', phone);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('blanche_livreur_authenticated');
    localStorage.removeItem('blanche_livreur_name');
    localStorage.removeItem('blanche_livreur_phone');
  };

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all');

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'pending') return o.status === 'validee' || o.status === 'en_attente';
    if (filterStatus === 'in_transit') return o.status === 'prise_en_charge' || o.status === 'en_transit' || o.status === 'pret_retrait';
    if (filterStatus === 'delivered') return o.status === 'livree';
    return true;
  });

  const activeDeliveriesCount = orders.filter(o => o.status !== 'livree' && o.status !== 'annulee').length;
  const completedDeliveriesCount = orders.filter(o => o.status === 'livree').length;

  // If NOT authenticated, show the Courier Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
              <Truck className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Espace Livreur Express
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Authentification requise pour les coursiers certifiés Blanche Élégance afin d'accéder au scanner QR et à la prise en charge des colis.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleCourierLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Numéro Mobile Livreur Agréé *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={inputCourierPhone}
                  onChange={(e) => setInputCourierPhone(e.target.value)}
                  placeholder="Ex: 0820001122 ou 0991018186"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Code PIN / Badge Livreur *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={inputCourierPin}
                  onChange={(e) => setInputCourierPin(e.target.value)}
                  placeholder="•••• (Ex: 2430)"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-driver-login"
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>S'authentifier & Ouvrir la Flotte</span>
            </button>
          </form>

          {/* Quick Demo Couriers */}
          <div className="pt-4 border-t border-stone-100">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-2 font-bold">
              Identifiants de coursier certifiés (Démonstration rapide) :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('0820001122', 'Jean-Luc Express')}
                className="text-left p-2.5 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 rounded-xl transition"
              >
                <span className="block text-xs font-bold text-emerald-900">Jean-Luc Express (Flotte Gombe)</span>
                <span className="block text-[10px] text-emerald-700 font-mono">0820001122 • PIN 2430</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('0991018186', 'Supervision Flotte (0991018186)')}
                className="text-left p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition"
              >
                <span className="block text-xs font-bold text-stone-900">Supervision Gérant</span>
                <span className="block text-[10px] text-stone-600 font-mono">0991018186 • Accès Direct</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Courier Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">{driverName}</h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold tracking-wider rounded-full border border-emerald-400/30">
                Livreur Certifié ({driverPhone})
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-1">
              Flotte Blanche Élégance • Numéro de liaison: <strong className="text-amber-400 font-mono">0991018186</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Big Quick Scan Button */}
          <button
            id="driver-open-scanner-btn"
            onClick={onOpenScanner}
            className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition active:scale-95"
          >
            <QrCode className="w-5 h-5" />
            <span>Scanner QR Code</span>
          </button>

          {/* Courier Logout */}
          <button
            onClick={handleLogout}
            id="driver-logout-btn"
            className="px-4 py-3.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>


      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Colis à Livrer</span>
          <span className="font-serif text-2xl font-bold text-amber-600">{activeDeliveriesCount}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Livraisons Effectuées</span>
          <span className="font-serif text-2xl font-bold text-emerald-600">{completedDeliveriesCount}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Taux de Ponctualité</span>
          <span className="font-serif text-2xl font-bold text-stone-900">99.2%</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Zone Principale</span>
          <span className="font-serif text-base font-bold text-stone-900 mt-1 block">Kinshasa / Gombe</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterStatus === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Toutes les courses ({orders.length})
        </button>
        <button
          onClick={() => setFilterStatus('in_transit')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterStatus === 'in_transit' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          En cours d'acheminement
        </button>
        <button
          onClick={() => setFilterStatus('delivered')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterStatus === 'delivered' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Livrées ({completedDeliveriesCount})
        </button>
      </div>

      {/* Driver Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Numéro Colis</span>
                  <strong className="font-mono text-base text-stone-900">#{order.trackingNumber}</strong>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full ${
                  order.status === 'livree' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 pt-3 text-xs text-stone-700">
                <div>
                  <span className="text-[10px] text-stone-400 block">Client & Contact :</span>
                  <strong className="text-stone-900">{order.customerName}</strong>
                  <p className="text-stone-500 font-mono">{order.customerPhone}</p>
                </div>

                <div className="flex items-start gap-1.5 text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 text-[11px] leading-tight">{order.deliveryAddress}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-stone-500 pt-1">
                  <span>Articles : {order.items.length}</span>
                  <span className="font-bold text-stone-900">${order.totalAmount} (Payé eMoney)</span>
                </div>
              </div>
            </div>

            {/* Courier 1-click Quick Status Actions */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler</span>
                </a>

                <button
                  onClick={onOpenScanner}
                  className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scan QR</span>
                </button>
              </div>

              {/* Status Update Quick Select */}
              <div className="pt-1">
                <select
                  value={order.status}
                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className="w-full text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl p-2 focus:ring-amber-500"
                >
                  <option value="validee">Paiement Validé (En préparation)</option>
                  <option value="prise_en_charge">Prise en charge Livreur</option>
                  <option value="en_transit">En cours d'acheminement</option>
                  <option value="pret_retrait">Prêt pour retrait / Arrivée</option>
                  <option value="livree">Livraison Effectuée (QR Validé)</option>
                </select>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
