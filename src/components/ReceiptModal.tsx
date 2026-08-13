import React from 'react';
import { X, Printer, Download, ShieldCheck, QrCode } from 'lucide-react';
import { Order } from '../types';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        id="receipt-modal-container"
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in zoom-in-95 my-6"
      >
        {/* Controls header (hidden on print) */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Facture & Reçu Officiel Blanche Élégance</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 space-y-6 text-stone-900 bg-white">
          {/* Brand header */}
          <div className="flex justify-between items-start border-b border-stone-200 pb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wider uppercase text-stone-900">
                Blanche Élégance
              </h1>
              <p className="text-xs text-amber-800 font-medium tracking-widest uppercase">
                Maison de Haute Couture & Prêt-à-Porter
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Avenue de la Justice, Gombe • Kinshasa, RDC<br />
                Tél: +243 99 101 81 86
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-bold text-amber-700 block">
                #{order.trackingNumber}
              </span>
              <span className="text-[11px] text-stone-400">
                Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </span>
              <div className="mt-2 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md inline-block">
                Paiement Validé ({order.paymentMethod})
              </div>
            </div>
          </div>

          {/* Client & Delivery information */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-2xl">
            <div>
              <span className="text-stone-400 font-semibold block uppercase text-[10px]">Facturé à :</span>
              <strong className="text-sm font-serif text-stone-900 block mt-0.5">{order.customerName}</strong>
              <p className="text-stone-600">{order.customerPhone}</p>
              <p className="text-stone-600">{order.customerEmail}</p>
            </div>
            <div>
              <span className="text-stone-400 font-semibold block uppercase text-[10px]">Adresse de Réception :</span>
              <p className="text-stone-800 font-medium mt-0.5">{order.deliveryAddress}</p>
              <p className="text-stone-500 text-[11px]">Réf. Transaction : {order.transactionRef}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="pb-2">Description Vêtement</th>
                  <th className="pb-2">Taille / Nuance</th>
                  <th className="pb-2 text-center">Qté</th>
                  <th className="pb-2 text-right">Prix Unitaire</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-stone-900">{it.product.name}</td>
                    <td className="py-3 text-stone-600">{it.selectedSize} ({it.selectedColor})</td>
                    <td className="py-3 text-center font-bold">{it.quantity}</td>
                    <td className="py-3 text-right font-serif">${it.product.price}</td>
                    <td className="py-3 text-right font-serif font-bold">${it.product.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & QR Code verification */}
          <div className="flex justify-between items-end border-t border-stone-200 pt-4">
            <div className="flex items-center gap-3">
              {order.qrCodeDataUrl && (
                <img src={order.qrCodeDataUrl} alt="QR Code Facture" className="w-20 h-20 border border-stone-200 rounded-lg p-1" />
              )}
              <div className="text-[10px] text-stone-500 max-w-xs">
                <span className="font-bold text-stone-800 block">Certificat d'Authenticité Numérique</span>
                Ce document certifie la transaction eMoney et autorise le retrait du colis.
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs text-stone-500">
                <span>Livraison Express : </span>
                <span className="text-emerald-700 font-semibold">Offerte</span>
              </div>
              <div className="text-sm">
                <span className="font-bold text-stone-900">Total TTC : </span>
                <span className="font-serif text-2xl font-bold text-amber-800">${order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
