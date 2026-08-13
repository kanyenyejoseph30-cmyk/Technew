import React from 'react';
import { ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatCDF } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  exchangeRate?: number;
  onOpenDetail: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  exchangeRate = 2850,
  onOpenDetail,
  onQuickAdd
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Container with overlay badges */}
      <div className="relative aspect-3/4 overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Stock & Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="px-2.5 py-1 bg-stone-900/90 backdrop-blur-xs text-amber-300 text-[10px] uppercase font-bold tracking-wider rounded-md shadow-xs">
              Édition Signature
            </span>
          )}

          {isOutOfStock ? (
            <span className="px-2.5 py-1 bg-red-600/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs">
              Rupture de Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-amber-600/95 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Plus que {product.stock} pièces
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-emerald-700/80 backdrop-blur-xs text-white text-[10px] font-medium tracking-wide rounded-md shadow-xs">
              Stock: {product.stock} dispo
            </span>
          )}
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
          <button
            id={`btn-view-${product.id}`}
            onClick={() => onOpenDetail(product)}
            className="p-3 bg-white text-stone-900 rounded-full hover:bg-stone-100 shadow-lg transition-transform hover:scale-110"
            title="Aperçu rapide"
            aria-label="Aperçu rapide"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {!isOutOfStock && (
            <button
              id={`btn-quick-add-${product.id}`}
              onClick={() => onQuickAdd(product)}
              className="px-4 py-2.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-full hover:bg-amber-400 shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-amber-700 mb-1">
            {product.category}
          </div>
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-bold text-stone-900">
                ${product.price}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  ${product.compareAtPrice}
                </span>
              )}
            </div>
            <div className="text-[11px] font-bold text-amber-700">
              {formatCDF(product.price, exchangeRate)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-stone-400">Tailles:</span>
              <div className="flex gap-1 text-[10px] font-medium text-stone-600">
                {product.sizes.slice(0, 3).map((s) => (
                  <span key={s} className="bg-stone-100 px-1.5 py-0.5 rounded">
                    {s}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-stone-400">+{product.sizes.length - 3}</span>
                )}
              </div>
            </div>
          </div>

          <button
            id={`btn-card-action-${product.id}`}
            onClick={() => {
              if (!isOutOfStock) onOpenDetail(product);
            }}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-95'
            }`}
          >
            {isOutOfStock ? 'Épuisé' : 'Détails & Achat'}
          </button>
        </div>
      </div>
    </div>
  );
};
