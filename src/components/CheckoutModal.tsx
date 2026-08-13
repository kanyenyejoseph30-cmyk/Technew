import React, { useState } from 'react';
import { X, ShieldCheck, Smartphone, CheckCircle, ArrowRight, Loader2, Info, Copy, Check } from 'lucide-react';
import { CartItem, PaymentMethod, Order, EMoneyConfig } from '../types';
import { generateQrCodeUrl, buildOrderQrPayload } from '../utils/qrHelper';
import { formatCDF } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  emoneyConfig: EMoneyConfig;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  emoneyConfig,
  onOrderCreated
}) => {
  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Form states
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<'domicile' | 'retrait_boutique'>('domicile');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  
  // Payment states
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa');
  const [paymentPhone, setPaymentPhone] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyMerchantPhone = () => {
    navigator.clipboard.writeText(emoneyConfig.merchantPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }
    if (deliveryType === 'domicile' && !deliveryAddress.trim()) {
      alert('Veuillez renseigner votre adresse de livraison.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique Tracking Number & Order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `BE-2026-${randomSuffix}`;
    const orderId = `ord-${Date.now()}`;
    const txRef = transactionRef.trim() || `TX-${selectedMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate Unique QR Code
    const qrPayload = buildOrderQrPayload(orderId, trackingNumber, customerPhone, totalAmount);
    const qrCodeUrl = await generateQrCodeUrl(qrPayload);

    const nowIso = new Date().toISOString();
    const nowReadable = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      trackingNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'client@blanche-elegance.com',
      deliveryType,
      deliveryAddress: deliveryType === 'domicile' ? deliveryAddress.trim() : 'Retrait en boutique Blanche Élégance (Gombe)',
      items: [...items],
      totalAmount,
      paymentMethod: selectedMethod,
      paymentPhone: paymentPhone.trim() || customerPhone.trim(),
      paymentStatus: 'paye',
      transactionRef: txRef,
      status: 'validee', // paiement eMoney validé directement
      qrCodeDataUrl: qrCodeUrl,
      createdAt: nowIso,
      updatedAt: nowIso,
      estimatedDelivery: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      driverName: 'Jean-Luc Express',
      driverPhone: emoneyConfig.merchantPhone,
      deliveryCoordinates: { lat: -4.303, lng: 15.301 },
      trackingHistory: [
        {
          status: 'en_attente',
          title: 'Commande enregistrée',
          description: `Paiement initié par eMoney (${selectedMethod.toUpperCase()}) pour un montant de $${totalAmount}`,
          location: 'Plateforme Centrale Blanche Élégance',
          timestamp: nowReadable,
          isCompleted: true
        },
        {
          status: 'validee',
          title: 'Paiement Validé & Emballage Précieux',
          description: `Réf transaction: ${txRef}. Pièces réservées et emballées avec soin sous housse hermétique.`,
          location: 'Atelier de préparation Blanche Élégance',
          timestamp: nowReadable,
          isCompleted: true
        },
        {
          status: 'prise_en_charge',
          title: 'En attente de prise en charge Livreur',
          description: 'Attribution de la course au livreur le plus proche.',
          location: 'Centre Logistique Blanche Élégance',
          timestamp: 'En attente',
          isCompleted: false
        },
        {
          status: 'en_transit',
          title: 'Acheminement vers le destinataire',
          description: 'Colis en cours de transport avec suivi GPS',
          location: 'En cours',
          timestamp: 'À venir',
          isCompleted: false
        },
        {
          status: 'pret_retrait',
          title: 'Prêt pour retrait / Arrivée imminente',
          description: 'Présentez votre QR Code sécurisé au livreur',
          location: 'Point de livraison',
          timestamp: 'À venir',
          isCompleted: false
        },
        {
          status: 'livree',
          title: 'Remise & Authentification Sécurisée',
          description: 'Vérification par scan du QR Code de la commande',
          location: 'Destination finale',
          timestamp: 'À venir',
          isCompleted: false
        }
      ]
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderCreated(newOrder);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        id="checkout-modal-container"
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in zoom-in-95 my-6"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="back-to-shop-from-checkout"
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold border border-stone-700 transition flex items-center gap-1.5"
            >
              <span>← Retour</span>
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-0.5">
                <ShieldCheck className="w-4 h-4" />
                Paiement Sécurisé Mobile eMoney
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
                Finaliser votre Commande Blanche Élégance
              </h2>
            </div>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Summary Banner */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="text-xs text-stone-700">
              <span className="font-bold text-stone-900 block font-serif text-sm">
                Récapitulatif : {items.length} produit(s)
              </span>
              <span>Livraison express offerte + QR Code de suivi unique</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Total TTC</span>
              <span className="font-serif text-2xl font-bold text-stone-900 block">${totalAmount}</span>
              <span className="text-xs font-bold text-amber-800 block">{formatCDF(totalAmount, emoneyConfig.exchangeRate)}</span>
            </div>
          </div>

          {/* Section 1: Customer Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              1. Informations Destinataire
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nom & Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Marie-Claire Mwamba"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Numéro de Téléphone (Pour SMS & Retrait) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex: 0812345678"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email (Facultatif pour reçu)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Ex: contact@exemple.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mode de Réception
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('domicile')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      deliveryType === 'domicile'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Livraison Domicile
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('retrait_boutique')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      deliveryType === 'retrait_boutique'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Retrait Boutique
                  </button>
                </div>
              </div>
            </div>

            {deliveryType === 'domicile' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Adresse Complète de Livraison *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Ex: Av. Colonel Mondjiba, n° 12, Réf. Galerie Royale, Gombe"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* Section 2: eMoney Payment selection */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center justify-between">
              <span>2. Mode de Paiement Mobile eMoney</span>
              <span className="text-xs font-sans font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Validation Instantanée
              </span>
            </h3>

            {/* Payment provider tabs */}
            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setSelectedMethod('mpesa')}
                className={`cursor-pointer p-3.5 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-1.5 text-center ${
                  selectedMethod === 'mpesa'
                    ? 'border-red-600 bg-red-50/60 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  M
                </div>
                <span className="text-xs font-bold text-stone-900">Vodacom M-Pesa</span>
                <span className="text-[10px] text-stone-500">*1122# ou App</span>
              </div>

              <div
                onClick={() => setSelectedMethod('orange_money')}
                className={`cursor-pointer p-3.5 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-1.5 text-center ${
                  selectedMethod === 'orange_money'
                    ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  OM
                </div>
                <span className="text-xs font-bold text-stone-900">Orange Money</span>
                <span className="text-[10px] text-stone-500">*144# ou App</span>
              </div>

              <div
                onClick={() => setSelectedMethod('airtel_money')}
                className={`cursor-pointer p-3.5 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-1.5 text-center ${
                  selectedMethod === 'airtel_money'
                    ? 'border-red-700 bg-red-50/60 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-red-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  AM
                </div>
                <span className="text-xs font-bold text-stone-900">Airtel Money</span>
                <span className="text-[10px] text-stone-500">*501# ou App</span>
              </div>
            </div>

            {/* Instructions box with Merchant Number */}
            <div className="bg-stone-900 text-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs text-stone-400">Numéro Marchand Officiel de Réception :</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-amber-400">
                    {emoneyConfig.merchantPhone}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMerchantPhone}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg transition"
                    title="Copier le numéro"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-stone-300 leading-relaxed">
                <p className="font-semibold text-white">Instructions simples de transfert :</p>
                <ol className="list-decimal list-inside space-y-1 text-stone-300 text-[11px]">
                  <li>Composez le code USSD de votre opérateur ou ouvrez votre application eMoney.</li>
                  <li>Effectuez un transfert de <strong className="text-amber-300">${totalAmount}</strong> (soit <strong className="text-amber-300">{formatCDF(totalAmount, emoneyConfig.exchangeRate)}</strong>) vers le numéro <strong className="text-amber-300">{emoneyConfig.merchantPhone}</strong> ({emoneyConfig.merchantName}).</li>
                  <li>Une fois le SMS de confirmation reçu, validez ci-dessous votre commande.</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                    Numéro Émetteur eMoney
                  </label>
                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="Numéro utilisé pour payer"
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                    ID / Réf de Transaction SMS (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Ex: MP8921831 ou MPESA..."
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-stone-200">
            <button
              id="confirm-order-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition active:scale-98 disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Génération du QR Code Unique & Enregistrement...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-stone-900" />
                  <span>Confirmer le Paiement eMoney & Générer mon QR Code</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition text-center"
            >
              ← Revenir au Panier / Annuler
            </button>

            <p className="text-[11px] text-stone-500 text-center mt-2">
              Un QR Code unique infalsifiable sera généré et associé à votre commande pour certifier la remise de votre colis.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
