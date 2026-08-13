import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, CheckCircle2, AlertTriangle, QrCode, Sparkles, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { parseOrderQrPayload } from '../utils/qrHelper';
import { playNotificationChime } from '../utils/notifications';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOrderScanned: (order: Order, actionType: 'prise_en_charge' | 'remise_livree') => void;
  scannerMode?: 'livreur' | 'gerant';
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOrderScanned,
  scannerMode = 'livreur'
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [scanAction, setScanAction] = useState<'prise_en_charge' | 'remise_livree'>('remise_livree');
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraActive(true);
        }
      } else {
        setCameraError('Caméra non disponible sur ce navigateur. Utilisez le mode saisie ou import.');
      }
    } catch (err: unknown) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Accès caméra refusé ou non supporté. Veuillez autoriser la caméra ou utiliser l’import.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleProcessCode = (rawPayload: string) => {
    const parsed = parseOrderQrPayload(rawPayload);
    let matchedOrder: Order | undefined;

    if (parsed?.orderId) {
      matchedOrder = orders.find(o => o.id === parsed.orderId);
    } else if (parsed?.trackingNumber) {
      matchedOrder = orders.find(o => o.trackingNumber.toLowerCase() === parsed.trackingNumber?.toLowerCase());
    } else {
      // Direct search by text
      const clean = rawPayload.trim().toLowerCase();
      matchedOrder = orders.find(o => 
        o.trackingNumber.toLowerCase().includes(clean) ||
        o.id.toLowerCase().includes(clean) ||
        o.customerPhone.includes(clean)
      );
    }

    if (matchedOrder) {
      playNotificationChime();
      setScannedOrder(matchedOrder);
      // Determine default action based on current status
      if (matchedOrder.status === 'validee' || matchedOrder.status === 'en_attente') {
        setScanAction('prise_en_charge');
      } else {
        setScanAction('remise_livree');
      }
    } else {
      alert(`QR Code invalide ou commande non trouvée pour "${rawPayload}".`);
    }
  };

  const handleConfirmValidation = () => {
    if (!scannedOrder) return;
    onOrderScanned(scannedOrder, scanAction);
    setScanSuccess(true);
    setTimeout(() => {
      setScanSuccess(false);
      setScannedOrder(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        id="qr-scanner-modal"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Scanner de Colis Blanche Élégance</h2>
              <p className="text-[11px] text-stone-400">Authentification sécurisée par QR Code</p>
            </div>
          </div>
          <button
            id="close-qr-scanner-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-3 bg-stone-100 p-1.5 border-b border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'camera' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>Caméra Live</span>
          </button>
          <button
            onClick={() => { stopCamera(); setActiveTab('upload'); }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'upload' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-amber-600" />
            <span>Image / Fichier</span>
          </button>
          <button
            onClick={() => { stopCamera(); setActiveTab('manual'); }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'manual' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Saisie Rapide</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-stone-950 border-2 border-stone-800 flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />

                {/* Target Frame overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-amber-400 border-dashed rounded-2xl relative animate-pulse flex items-center justify-center">
                    <span className="text-[10px] text-amber-300 font-bold bg-stone-950/70 px-2 py-0.5 rounded">
                      Centrez le QR Code ici
                    </span>
                  </div>
                </div>

                {cameraError && (
                  <div className="absolute inset-0 bg-stone-900/90 p-4 text-center flex flex-col items-center justify-center text-xs text-amber-200">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
                    <p>{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-3 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Réessayer la Caméra
                    </button>
                  </div>
                )}
              </div>

              {/* Quick simulation buttons for existing orders while in camera mode */}
              <div className="text-center space-y-2">
                <span className="text-[11px] text-stone-500 block">
                  Ou simuler le scan immédiat d'un colis en cours :
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {orders.slice(0, 3).map((ord) => (
                    <button
                      key={ord.id}
                      onClick={() => handleProcessCode(ord.trackingNumber)}
                      className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-amber-100 text-stone-800 rounded-lg border border-stone-200 font-mono transition"
                    >
                      Scan #{ord.trackingNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/20 transition flex flex-col items-center justify-center space-y-2">
                <Upload className="w-10 h-10 text-amber-600" />
                <span className="text-sm font-bold text-stone-800">
                  Choisir une capture du QR Code
                </span>
                <span className="text-xs text-stone-500">
                  Sélectionnez l'image téléchargée par le client
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // Demo scan matching first pending order
                      if (orders.length > 0) {
                        handleProcessCode(orders[0].trackingNumber);
                      }
                    }
                  }}
                />
              </label>
            </div>
          )}

          {/* MANUAL TAB */}
          {activeTab === 'manual' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Numéro de Suivi ou Téléphone Client :
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ex: BE-2026-9812 ou 0812345678"
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
                <button
                  onClick={() => handleProcessCode(manualCode)}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Valider
                </button>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                  Commandes prêtes à scanner :
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => handleProcessCode(ord.trackingNumber)}
                      className="p-2.5 bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-200 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="font-mono text-stone-900">{ord.trackingNumber}</strong>
                        <span className="text-stone-500 block text-[11px]">{ord.customerName} ({ord.customerPhone})</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCANNED RESULT MODAL VIEW */}
          {scannedOrder && (
            <div className="bg-amber-50/80 border-2 border-amber-400 rounded-2xl p-5 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Colis Identifié avec Succès !</span>
                </div>
                <span className="font-mono text-xs font-bold text-stone-900">
                  #{scannedOrder.trackingNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                <div>
                  <span className="text-[10px] text-stone-500 block">Client Destinataire :</span>
                  <strong>{scannedOrder.customerName}</strong>
                  <p className="text-[11px] text-stone-500">{scannedOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">Montant Payé eMoney :</span>
                  <strong className="text-emerald-700">${scannedOrder.totalAmount}</strong>
                  <p className="text-[11px] text-stone-500">{scannedOrder.items.length} article(s)</p>
                </div>
              </div>

              {/* Action selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Action de validation à certifier :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScanAction('prise_en_charge')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      scanAction === 'prise_en_charge'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300'
                    }`}
                  >
                    1. Prise en charge Livreur
                  </button>

                  <button
                    type="button"
                    onClick={() => setScanAction('remise_livree')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      scanAction === 'remise_livree'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-stone-700 border-stone-300'
                    }`}
                  >
                    2. Remise & Retrait Confirmé
                  </button>
                </div>
              </div>

              <button
                id="btn-confirm-qr-scan"
                onClick={handleConfirmValidation}
                disabled={scanSuccess}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                {scanSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Statut validé & synchronisé !</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider & Envoyer Notification Instantanée</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
