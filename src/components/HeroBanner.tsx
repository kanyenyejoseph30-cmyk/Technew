import React from 'react';
import { Search, ShieldCheck, QrCode, Smartphone, Sparkles, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroBannerProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTrackClick: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Tous',
  'Robes',
  'Costumes & Vestes',
  'Chemises & Tops',
  'Manteaux & Abayas',
  'Chaussures',
  'Accessoires'
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onTrackClick
}) => {
  return (
    <div className="relative bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white overflow-hidden border-b border-stone-800">
      {/* Decorative luxury accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-stone-700/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Headline & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-medium tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Nouvelle Collection Haute Couture 2026
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-stone-100">
              L'Élégance Pure & le Raffinement Intemporel.
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Découvrez les créations exclusives de la maison <strong className="text-white font-medium">Blanche Élégance</strong>. Paiements mobiles sécurisés <span className="text-amber-300 font-medium">M-Pesa, Orange Money & Airtel Money</span>, gestion de stock en temps réel et suivi instantané par <strong className="text-white font-medium">QR Code Unique</strong>.
            </p>

            {/* Quick Search Bar */}
            <div className="max-w-md mx-auto lg:mx-0 relative">
              <input
                id="hero-product-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher une robe, un costume, chemise, abaya..."
                className="w-full pl-11 pr-4 py-3.5 bg-stone-800/90 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition shadow-inner"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/40 border border-stone-800">
                <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] text-stone-300 leading-tight">Paiements eMoney Directs</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/40 border border-stone-800">
                <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] text-stone-300 leading-tight">QR Code Remise Sécurisée</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/40 border border-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-stone-300 leading-tight">Stock Réel & Authentique</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tracking Quick Action Card */}
          <div className="lg:col-span-5">
            <div className="bg-stone-800/80 backdrop-blur-md border border-stone-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-stone-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    BE
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Suivi Express Blanche Élégance</h3>
                    <p className="text-[11px] text-stone-400">Vérification de colis en direct</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 rounded-full">
                  Live GPS
                </span>
              </div>

              <div className="py-5 space-y-3">
                <p className="text-xs text-stone-300 leading-relaxed">
                  Vous avez déjà commandé ? Entrez votre numéro de suivi (ex: <code className="bg-stone-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">BE-2026-9812</code>) ou scannez votre QR Code de retrait.
                </p>

                <button
                  id="hero-track-order-btn"
                  onClick={onTrackClick}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm rounded-xl transition shadow-lg active:scale-98"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Où est votre Commande ? (Suivi Live)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="text-[11px] text-stone-400 bg-stone-900/60 p-3 rounded-lg flex items-center justify-between">
                <span>Numéro marchand officiel :</span>
                <span className="font-mono text-amber-300 font-bold">0991018186</span>
              </div>
            </div>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 pt-6 border-t border-stone-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-2 shrink-0">
              Rayons :
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
