import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string, color: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product?.image || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || 'Blanc');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedSize(product.sizes[0] || 'Standard');
      setSelectedColor(product.colors[0] || 'Blanc');
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const maxAvailable = Math.min(product.stock, 10);

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div 
        id="product-detail-modal"
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in zoom-in-95"
      >
        {/* Close Button */}
        <button
          id="close-product-detail-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Gallery Column */}
          <div className="p-6 bg-stone-50 flex flex-col justify-between">
            <div className="aspect-3/4 rounded-2xl overflow-hidden bg-white shadow-inner relative">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute bottom-3 left-3 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Stock limité: {product.stock} exemplaires
                </div>
              )}
            </div>

            {/* Thumbnail list if multiple images exist */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === img ? 'border-amber-600 scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Vignette ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                  {product.category}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isOutOfStock ? 'Rupture' : `En stock (${product.stock} unités)`}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-stone-900">
                  ${product.price}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-base text-stone-400 line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
                <span className="text-xs text-stone-500 font-medium">
                  (Paiement Mobile eMoney accepté)
                </span>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed border-t border-b border-stone-100 py-3">
                {product.description}
              </p>

              {/* Sizes Selection */}
              {product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
                    <span>Choisir une Taille :</span>
                    <span className="text-amber-700">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition ${
                          selectedSize === sz
                            ? 'bg-stone-900 text-white border-stone-900 font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selection */}
              {product.colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
                    <span>Nuance & Finition :</span>
                    <span className="text-amber-700">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                          selectedColor === col
                            ? 'bg-amber-100 text-amber-900 border-amber-500 font-semibold'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-semibold text-stone-700">Quantité :</span>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-stone-600 hover:bg-stone-100 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-semibold text-stone-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                      className="px-3 py-1 text-stone-600 hover:bg-stone-100 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-400">Total : ${product.price * quantity}</span>
                </div>
              )}
            </div>

            {/* Action & Assurances */}
            <div className="pt-6 space-y-3">
              <button
                id="btn-modal-add-to-cart"
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-98 ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Ajouté au Panier !</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Article Indisponible</span>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Ajouter au Panier — ${product.price * quantity}</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>QR Code de retrait certifié</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Livraison express suivie live</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
