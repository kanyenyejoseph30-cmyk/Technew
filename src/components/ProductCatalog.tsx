import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: ProductCategory;
  searchQuery: string;
  exchangeRate?: number;
  onOpenDetail: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  searchQuery,
  exchangeRate = 2850,
  onOpenDetail,
  onQuickAdd
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name'>('featured');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Tous' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      // Stock filter
      if (onlyInStock && item.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // featured
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, onlyInStock, sortBy]);

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span>{selectedCategory === 'Tous' ? 'Toutes nos Collections' : selectedCategory}</span>
            <span className="text-xs font-sans font-normal text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} modèle(s)
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Mise à jour du stock en temps réel & expédition soignée
          </p>
        </div>

        {/* Sort & Quick Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              id="filter-in-stock"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>En stock uniquement</span>
          </label>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-400" />
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price_asc' | 'price_desc' | 'name')}
              className="bg-white border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="featured">Recommandés & Vedettes</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name">Alphabétique (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-800">Aucun vêtement ne correspond</h3>
          <p className="text-xs text-stone-500">
            Essayez de modifier votre recherche ou de désactiver le filtre "En stock uniquement".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              exchangeRate={exchangeRate}
              onOpenDetail={onOpenDetail}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      )}

    </section>
  );
};
