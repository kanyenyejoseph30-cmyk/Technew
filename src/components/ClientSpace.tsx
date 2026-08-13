import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { User, Package, QrCode, Phone, Mail, MapPin, Download, ArrowRight, ShieldCheck, FileText, Lock, KeyRound, LogOut, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ClientSpaceProps {
  orders: Order[];
  onSelectOrderToTrack: (trackingNumber: string) => void;
  onOpenReceipt: (order: Order) => void;
}

export const ClientSpace: React.FC<ClientSpaceProps> = ({
  orders,
  onSelectOrderToTrack,
  onOpenReceipt
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('blanche_client_authenticated') === 'true';
  });
  const [clientPhone, setClientPhone] = useState<string>(() => {
    return localStorage.getItem('blanche_client_phone') || '';
  });
  const [clientName, setClientName] = useState<string>(() => {
    return localStorage.getItem('blanche_client_name') || '';
  });
  
  // Auth Form State
  const [inputPhone, setInputPhone] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync to storage
  const handleLoginSuccess = (phone: string, name?: string) => {
    const matchedOrder = orders.find(o => o.customerPhone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
    const finalName = name || matchedOrder?.customerName || 'Client Blanche Élégance';
    
    setIsAuthenticated(true);
    setClientPhone(phone);
    setClientName(finalName);
    localStorage.setItem('blanche_client_authenticated', 'true');
    localStorage.setItem('blanche_client_phone', phone);
    localStorage.setItem('blanche_client_name', finalName);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setClientPhone('');
    setClientName('');
    setIsOtpSent(false);
    setOtpCode('');
    setAuthError(null);
    localStorage.removeItem('blanche_client_authenticated');
    localStorage.removeItem('blanche_client_phone');
    localStorage.removeItem('blanche_client_name');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleaned = inputPhone.replace(/[\s\-\+]/g, '');
    if (!cleaned || cleaned.length < 8) {
      setAuthError('Veuillez saisir un numéro de téléphone valide (ex: 0812345678).');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(code);
    setOtpCode(code); // Pre-fill for user convenience
    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setAuthError('Veuillez saisir le code de vérification à 4 chiffres.');
      return;
    }
    handleLoginSuccess(inputPhone, inputName);
  };

  const handleQuickDemoLogin = (phone: string, name: string) => {
    setInputPhone(phone);
    handleLoginSuccess(phone, name);
  };

  // Filter orders for active authenticated client
  const clientOrders = orders.filter(o => 
    !clientPhone || o.customerPhone.replace(/[\s\-\+]/g, '').includes(clientPhone.replace(/[\s\-\+]/g, '')) || 
    (o.customerName && clientName && o.customerName.toLowerCase().includes(clientName.toLowerCase()))
  );

  const activeClientName = clientName || clientOrders[0]?.customerName || 'Client Blanche Élégance';
  const activeClientEmail = clientOrders[0]?.customerEmail || 'client@blanche-elegance.com';
  const activeClientAddress = clientOrders[0]?.deliveryAddress || 'Kinshasa, RDC';

  // If NOT authenticated, show the dedicated Client Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
              <User className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Authentification Client
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Connectez-vous avec votre numéro de téléphone pour consulter l'historique de vos commandes, reçus fiscaux et QR codes de retrait.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Votre Nom ou Prénom (Optionnel)
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Ex: Marie Kabila"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Numéro de Téléphone Client *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    placeholder="Ex: 0812345678 ou 0991018186"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  />
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Utilisé lors du paiement M-Pesa, Orange Money ou Airtel Money.
                </span>
              </div>

              <button
                type="submit"
                id="btn-client-send-otp"
                className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Recevoir mon Code de Connexion SMS</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Code de sécurité SMS envoyé au {inputPhone}</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  Code de vérification simulé généré : <strong className="font-mono text-amber-900 bg-amber-200/70 px-1.5 py-0.5 rounded">{simulatedOtp}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Code SMS / OTP à 4 chiffres *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Ex: 4920"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-lg font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="px-4 py-3 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 transition"
                >
                  Changer de numéro
                </button>
                <button
                  type="submit"
                  id="btn-client-verify-otp"
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valider et Accéder à mon Espace</span>
                </button>
              </div>
            </form>
          )}

          {/* Demo Quick Accounts */}
          <div className="pt-4 border-t border-stone-100">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-2 font-bold">
              Comptes clients récents disponibles pour démonstration :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('0812345678', 'Marie Kabila')}
                className="text-left p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition"
              >
                <span className="block text-xs font-bold text-stone-800">Marie Kabila</span>
                <span className="block text-[10px] text-amber-700 font-mono">0812345678 (2 commandes)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('0991018186', 'Joseph Kanyenye')}
                className="text-left p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition"
              >
                <span className="block text-xs font-bold text-stone-800">Joseph Kanyenye</span>
                <span className="block text-[10px] text-amber-700 font-mono">0991018186 (Client & Gérant)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Client Profile Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-950 font-serif font-bold text-2xl flex items-center justify-center shadow-lg">
            {activeClientName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">{activeClientName}</h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold tracking-wider rounded-full border border-emerald-400/30">
                Compte Authentifié
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-stone-300 mt-1">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> {clientPhone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-400" /> {activeClientEmail}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {activeClientAddress}</span>
            </div>
          </div>
        </div>

        {/* Account controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleLogout}
            id="btn-client-logout"
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Vos Commandes & Colis ({clientOrders.length})</h2>
            <p className="text-xs text-stone-500">QR Code unique et reçu fiscal pour chaque commande associée au numéro {clientPhone}</p>
          </div>
        </div>

        {clientOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-3">
            <Package className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="font-serif text-base font-bold text-stone-800">Aucune commande pour ce numéro ({clientPhone})</h3>
            <p className="text-xs text-stone-500">
              Passez votre première commande sur notre catalogue avec ce numéro pour bénéficier du suivi en direct.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clientOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Numéro de suivi</span>
                    <strong className="font-mono text-base text-stone-900">#{order.trackingNumber}</strong>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full ${
                    order.status === 'livree'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                  <div className="text-xs text-stone-500 flex justify-between">
                    <span>Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span className="font-bold text-stone-900">${order.totalAmount}</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-100 shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-xs font-medium text-stone-800 line-clamp-1">{item.product.name} (x{item.quantity})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <QrCode className="w-4 h-4 text-amber-600" />
                      QR Code de Réception
                    </span>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      Présentez ce QR Code au livreur express pour valider la réception.
                    </p>
                  </div>
                  <div className="bg-white p-1.5 rounded-xl border border-stone-200 shadow-xs shrink-0">
                    <img src={order.qrCodeDataUrl} alt="QR Commande" className="w-16 h-16" />
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => onSelectOrderToTrack(order.trackingNumber)}
                    className="px-3 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <span>Suivre le Colis</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => onOpenReceipt(order)}
                    className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Télécharger Reçu</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

