import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';
import { formatCDF } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  exchangeRate?: number;
  onUpdateQuantity: (productId: string, size: string, color: string, newQty: number) => void;
  onRemoveItem: (productId: string, size: string, color: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  exchangeRate = 2850,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-stone-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-bold transition flex items-center gap-1"
            >
              <span>← Retour</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900">Votre Panier</h2>
              <p className="text-[10px] sm:text-[11px] text-stone-500">{totalCount} article(s) sélectionné(s)</p>
            </div>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200 transition"
            aria-label="Fermer Panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-base font-semibold text-stone-700">Votre panier est vide</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explorez nos collections exclusives et ajoutez les pièces de votre choix.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-stone-800 transition"
              >
                <span>← Retourner à la Boutique</span>
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              const itemKey = `${item.product.id}-${item.selectedSize}-${item.selectedColor}`;
              return (
                <div key={itemKey} className={`pt-4 flex gap-4 ${index === 0 ? 'pt-0' : ''}`}>
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl border border-stone-200 bg-stone-50 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)}
                          className="text-stone-400 hover:text-red-600 transition p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500 flex gap-2 mt-0.5">
                        <span>Taille: <strong className="text-stone-700">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>Couleur: <strong className="text-stone-700">{item.selectedColor}</strong></span>
                      </div>
                      <div className="text-xs font-serif font-bold text-stone-900 mt-1 flex items-baseline gap-1.5">
                        <span>${item.product.price}</span>
                        <span className="text-[11px] text-amber-700 font-semibold">({formatCDF(item.product.price, exchangeRate)})</span>
                        <span className="text-[10px] text-stone-400 font-normal">/ pièce</span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, Math.min(item.product.stock, item.quantity + 1))}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-sm text-stone-900 block">
                          ${item.product.price * item.quantity}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 block">
                          {formatCDF(item.product.price * item.quantity, exchangeRate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between items-baseline">
                <span>Sous-total articles :</span>
                <div className="text-right">
                  <span className="font-serif font-bold text-stone-900 mr-1.5">${totalAmount}</span>
                  <span className="text-[11px] text-amber-700 font-semibold">({formatCDF(totalAmount, exchangeRate)})</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Livraison Express & QR Code :</span>
                <span className="text-emerald-700 font-medium">Offerte (Spéciale 2026)</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-stone-200 pt-2 text-sm">
                <span className="font-bold text-stone-900">Total à Payer :</span>
                <div className="text-right">
                  <span className="font-serif font-bold text-lg text-stone-900 mr-2">${totalAmount}</span>
                  <span className="font-serif font-bold text-base text-amber-700">{formatCDF(totalAmount, exchangeRate)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="btn-cart-checkout"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98"
              >
                <span>Commander & Payer par eMoney</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition"
              >
                ← Continuer mes achats
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-1 text-[11px] text-stone-400 hover:text-stone-600 text-center transition"
              >
                Vider le panier
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paiements M-Pesa, Orange & Airtel Money cryptés</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
