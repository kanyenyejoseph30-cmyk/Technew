import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import { 
  Search, 
  QrCode, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Download, 
  FileText, 
  AlertCircle, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Store,
  User
} from 'lucide-react';
import { formatCDF } from '../utils/currency';

interface OrderTrackingViewProps {
  orders: Order[];
  selectedTrackingNumber?: string;
  exchangeRate?: number;
  onGoToShop?: () => void;
  onGoToClientSpace?: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenReceipt: (order: Order) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  selectedTrackingNumber,
  exchangeRate = 2850,
  onGoToShop,
  onGoToClientSpace,
  onUpdateOrderStatus,
  onOpenReceipt
}) => {
  const [searchInput, setSearchInput] = useState<string>(selectedTrackingNumber || '');
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (selectedTrackingNumber) {
      const found = orders.find(o => o.trackingNumber.toLowerCase() === selectedTrackingNumber.toLowerCase() || o.id === selectedTrackingNumber);
      if (found) return found;
    }
    return orders[0] || null;
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      o => o.trackingNumber.toLowerCase().includes(query) ||
           o.id.toLowerCase().includes(query) ||
           o.customerPhone.includes(query) ||
           o.customerName.toLowerCase().includes(query)
    );

    if (found) {
      setActiveOrder(found);
    } else {
      alert(`Aucune commande trouvée pour "${searchInput}". Vérifiez votre numéro de suivi.`);
    }
  };

  // Status progression helper
  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'en_attente': return 0;
      case 'validee': return 1;
      case 'prise_en_charge': return 2;
      case 'en_transit': return 3;
      case 'pret_retrait': return 4;
      case 'livree': return 5;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStatusStepIndex(activeOrder.status) : 0;

  const STATUS_STEPS = [
    { title: 'Commande Enregistrée', desc: 'Paiement mobile eMoney initié' },
    { title: 'Paiement Validé', desc: 'Vêtements emballés sous housse' },
    { title: 'Prise en Charge Livreur', desc: 'Scan du colis au centre logistique' },
    { title: 'En Cours d’Acheminement', desc: 'Livreur en route vers l’adresse' },
    { title: 'Prêt pour Retrait / Arrivée', desc: 'Livreur dans votre quartier' },
    { title: 'Livraison Confirmée', desc: 'QR Code de remise validé' }
  ];

  // Advance simulation for demo
  const handleSimulateNextStep = () => {
    if (!activeOrder) return;
    const statuses: OrderStatus[] = ['en_attente', 'validee', 'prise_en_charge', 'en_transit', 'pret_retrait', 'livree'];
    const nextIdx = (currentStepIdx + 1) % statuses.length;
    onUpdateOrderStatus(activeOrder.id, statuses[nextIdx]);
    // update active order reference
    const updated = orders.find(o => o.id === activeOrder.id);
    if (updated) setActiveOrder(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Back Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2">
          {onGoToShop && (
            <button
              id="btn-back-to-shop-from-tracking"
              onClick={onGoToShop}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-md transition active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>← Retour à la Boutique</span>
            </button>
          )}

          {onGoToClientSpace && (
            <button
              id="btn-goto-client-from-tracking"
              onClick={onGoToClientSpace}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold transition active:scale-95"
            >
              <User className="w-4 h-4 text-amber-700" />
              <span>Mon Espace Client</span>
            </button>
          )}
        </div>

        {onGoToShop && (
          <button
            onClick={onGoToShop}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Voir tout le catalogue</span>
          </button>
        )}
      </div>

      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          Suivi des Colis en Temps Réel & QR Code Unique
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Où est votre Commande Blanche Élégance ?
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Suivez chaque étape de la préparation à la remise finale de vos vêtements. Présentez votre <strong className="text-stone-900">QR Code unique</strong> au livreur pour certifier l’authentification sécurisée.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mt-6 flex gap-2">
          <div className="relative flex-1">
            <input
              id="tracking-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Entrez votre numéro de suivi (ex: BE-2026-9812 ou votre téléphone)"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-300 rounded-2xl text-sm text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            id="tracking-search-btn"
            type="submit"
            className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-2xl shadow-md transition"
          >
            Rechercher
          </button>
        </form>

        {/* Quick chip buttons of existing orders */}
        {orders.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] text-stone-500">Commandes récentes :</span>
            {orders.slice(0, 4).map((ord) => (
              <button
                key={ord.id}
                onClick={() => {
                  setSearchInput(ord.trackingNumber);
                  setActiveOrder(ord);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition font-mono ${
                  activeOrder?.id === ord.id
                    ? 'bg-amber-600 text-white border-amber-600 font-bold'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {ord.trackingNumber} ({ord.customerName.split(' ')[0]})
              </button>
            ))}
          </div>
        )}
      </div>

      {!activeOrder ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-stone-900">Aucune commande sélectionnée</h3>
          <p className="text-xs text-stone-500 mt-1">
            Veuillez entrer un numéro de suivi dans la barre de recherche ci-dessus pour afficher l'état en direct.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Main Status Hero Card */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Order Info */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-amber-400">
                    #{activeOrder.trackingNumber}
                  </span>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs uppercase font-bold rounded-full border border-amber-400/30">
                    {STATUS_STEPS[currentStepIdx]?.title}
                  </span>
                  <span className="text-xs text-stone-400">
                    Paiement : <strong className="text-emerald-400 uppercase">{activeOrder.paymentMethod}</strong> (${activeOrder.totalAmount} • <span className="text-amber-300 font-semibold">{formatCDF(activeOrder.totalAmount, exchangeRate)}</span>)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300 pt-2">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Destinataire :</span>
                    <strong className="text-white text-sm">{activeOrder.customerName}</strong>
                    <p className="text-stone-400">{activeOrder.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Lieu de livraison :</span>
                    <strong className="text-white text-sm">{activeOrder.deliveryAddress}</strong>
                    <p className="text-stone-400">Type: {activeOrder.deliveryType === 'domicile' ? 'Livraison à Domicile' : 'Retrait Boutique'}</p>
                  </div>
                </div>

                {/* Progress Bar Line */}
                <div className="pt-6">
                  <div className="grid grid-cols-6 gap-2 text-center text-[10px] sm:text-xs">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-amber-500 text-stone-950 font-bold scale-110 shadow-lg shadow-amber-500/50'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-800 text-stone-500 border border-stone-700'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span>{idx + 1}</span>}
                          </div>
                          <span className={`line-clamp-2 leading-tight ${isCurrent ? 'text-amber-300 font-bold' : isCompleted ? 'text-stone-200' : 'text-stone-500'}`}>
                            {step.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-800">
                  <button
                    onClick={() => onOpenReceipt(activeOrder)}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Voir la Facture / Reçu</span>
                  </button>

                  <button
                    onClick={handleSimulateNextStep}
                    className="px-4 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                    title="Simulateur d'avancement pour test"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Simuler l'Étape Suivante (Test Live)</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Unique QR Code for Handover */}
              <div className="lg:col-span-4 bg-white text-stone-900 rounded-2xl p-5 text-center shadow-xl border border-stone-200">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    QR Code Authentification
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="p-3 bg-stone-50 rounded-xl my-3 inline-block border border-stone-200 shadow-inner">
                  {activeOrder.qrCodeDataUrl ? (
                    <img
                      src={activeOrder.qrCodeDataUrl}
                      alt={`QR Code Commande ${activeOrder.trackingNumber}`}
                      className="w-44 h-44 object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-stone-400">
                      Génération QR...
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-stone-600 leading-tight">
                  Présentez ce QR Code unique au livreur pour <strong>authentifier la remise</strong> en main propre.
                </p>

                <a
                  href={activeOrder.qrCodeDataUrl}
                  download={`QR_Blanche_Elegance_${activeOrder.trackingNumber}.png`}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger le QR Code</span>
                </a>
              </div>

            </div>
          </div>

          {/* Two Columns: Live GPS / Driver Details & Detailed Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Driver & Live Route Simulation */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Assigned Courier Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span>Livreur Assigné & Support Express</span>
                </h3>

                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="w-12 h-12 rounded-full bg-stone-900 text-amber-400 font-bold text-lg flex items-center justify-center">
                    JL
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-stone-900">{activeOrder.driverName || 'Jean-Luc Express'}</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        En Service
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">Véhicule sécurisé Blanche Élégance</p>
                    <p className="text-xs font-mono text-amber-800 font-bold mt-0.5">
                      {activeOrder.driverPhone || '0991018186'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${activeOrder.driverPhone || '0991018186'}`}
                    className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Appeler le Livreur</span>
                  </a>

                  <a
                    href={`https://wa.me/243991018186?text=Bonjour,%20je%20suis%20${encodeURIComponent(activeOrder.customerName)}%20au%20sujet%20de%20ma%20commande%20${activeOrder.trackingNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <span>WhatsApp Express</span>
                  </a>
                </div>
              </div>

              {/* Simulated GPS Live Map */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <span>Localisation & Itinéraire GPS</span>
                  </h3>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live
                  </span>
                </div>

                {/* Styled Map Canvas simulation */}
                <div className="h-48 rounded-2xl bg-stone-100 border border-stone-200 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Road Path Line */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 40 120 Q 140 40 280 80 T 420 140"
                      fill="transparent"
                      stroke="#d97706"
                      strokeWidth="4"
                      strokeDasharray="6 6"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Boutique Pin */}
                  <div className="absolute left-8 bottom-8 text-center">
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg border-2 border-white mx-auto">
                      BÉ
                    </div>
                    <span className="text-[10px] font-bold text-stone-800 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1 block">
                      Atelier Gombe
                    </span>
                  </div>

                  {/* Courier Van Live Pin */}
                  <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xl border-2 border-white animate-bounce mx-auto">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full shadow-xs mt-1 block">
                      Colis en mouvement
                    </span>
                  </div>

                  {/* Destination Pin */}
                  <div className="absolute right-8 top-6 text-center">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border-2 border-white mx-auto">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-800 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1 block">
                      Votre Adresse
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-stone-600 pt-1">
                  <span>Temps estimé d’arrivée : <strong className="text-stone-900">~25 minutes</strong></span>
                  <span>Zone : <strong className="text-stone-900">Kinshasa / Gombe</strong></span>
                </div>
              </div>

            </div>

            {/* Right: Detailed Steps History & Items Summary */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Detailed Tracking Steps */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Journal de Suivi en Temps Réel</span>
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
                  {activeOrder.trackingHistory.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    return (
                      <div key={idx} className="relative flex items-start gap-4 pl-8">
                        {/* Bullet Icon */}
                        <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                          isDone
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'bg-white border-stone-300 text-stone-400'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-stone-300" />}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 bg-stone-50/80 p-4 rounded-2xl border border-stone-100">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                            <h4 className={`text-sm font-bold ${isDone ? 'text-stone-900' : 'text-stone-500'}`}>
                              {step.title}
                            </h4>
                            <span className="text-[11px] font-mono text-stone-400">{step.timestamp}</span>
                          </div>
                          <p className="text-xs text-stone-600">{step.description}</p>
                          <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-2">
                            <MapPin className="w-3 h-3" />
                            <span>{step.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items in Parcel */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Articles inclus dans ce colis ({activeOrder.items.length})
                </h3>

                <div className="divide-y divide-stone-100">
                  {activeOrder.items.map((it, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-12 h-14 object-cover rounded-lg border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 font-serif">{it.product.name}</h4>
                          <p className="text-[11px] text-stone-500">
                            Taille: {it.selectedSize} • Couleur: {it.selectedColor} • Qté: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-xs text-stone-900 block">
                          ${it.product.price * it.quantity}
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold block">
                          {formatCDF(it.product.price * it.quantity, exchangeRate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Bottom Back to Shop Bar */}
      {onGoToShop && (
        <div className="pt-6 border-t border-stone-200 flex flex-wrap justify-center gap-3">
          <button
            onClick={onGoToShop}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-lg transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Retourner faire du shopping dans la Boutique</span>
          </button>
        </div>
      )}

    </div>
  );
};
