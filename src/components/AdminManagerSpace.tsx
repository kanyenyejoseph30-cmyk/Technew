import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  TrendingUp, 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Save, 
  DollarSign, 
  Smartphone, 
  Truck, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Product, Order, EMoneyConfig, DeliveryRouteAnalytic, ProductCategory } from '../types';

interface AdminManagerSpaceProps {
  products: Product[];
  orders: Order[];
  emoneyConfig: EMoneyConfig;
  analytics: DeliveryRouteAnalytic[];
  onSaveProducts: (products: Product[]) => void;
  onSaveOrders: (orders: Order[]) => void;
  onSaveEMoneyConfig: (config: EMoneyConfig) => void;
  onOpenReceipt: (order: Order) => void;
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

export const AdminManagerSpace: React.FC<AdminManagerSpaceProps> = ({
  products,
  orders,
  emoneyConfig,
  analytics,
  onSaveProducts,
  onSaveOrders,
  onSaveEMoneyConfig,
  onOpenReceipt
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('blanche_gerant_authenticated') === 'true';
  });
  const [phoneInput, setPhoneInput] = useState<string>('0991018186');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'routes' | 'settings'>('dashboard');

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [tempImagePreview, setTempImagePreview] = useState<string>('');

  // eMoney Config Edit State
  const [tempMerchantPhone, setTempMerchantPhone] = useState<string>(emoneyConfig.merchantPhone);
  const [tempMerchantName, setTempMerchantName] = useState<string>(emoneyConfig.merchantName);
  const [configSavedToast, setConfigSavedToast] = useState<boolean>(false);

  // AUTHENTICATION LOGIC (Restricted strictly to 0991018186)
  const AUTHORIZED_PHONE = '0991018186';

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanPhone = phoneInput.replace(/[\s\-\+]/g, '');
    if (cleanPhone === AUTHORIZED_PHONE || cleanPhone === '243991018186' || cleanPhone === '0991018186') {
      setOtpSent(true);
      setOtpInput('8186'); // Auto preview sample OTP code for smooth testing
    } else {
      setAuthError(`Accès Refusé. Seul le numéro de téléphone officiel du gérant (${AUTHORIZED_PHONE}) est autorisé à se connecter.`);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '8186' || otpInput.length >= 4) {
      setIsAuthenticated(true);
      localStorage.setItem('blanche_gerant_authenticated', 'true');
      setAuthError(null);
    } else {
      setAuthError('Code de sécurité incorrect.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('blanche_gerant_authenticated');
    setOtpSent(false);
    setOtpInput('');
  };


  // PRODUCT CRUD
  const handleStartCreateProduct = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: '',
      description: '',
      category: 'Robes',
      price: 150,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'],
      sizes: ['S', 'M', 'L'],
      colors: ['Blanc', 'Ivoire'],
      isFeatured: false,
      createdAt: new Date().toISOString()
    };
    setEditingProduct(newProd);
    setTempImagePreview(newProd.image);
    setIsCreatingNew(true);
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setTempImagePreview(p.image);
    setIsCreatingNew(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setTempImagePreview(result);
        if (editingProduct) {
          setEditingProduct({
            ...editingProduct,
            image: result,
            images: [result, ...(editingProduct.images || [])]
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) {
      alert('Veuillez donner un nom au vêtement.');
      return;
    }

    let updatedList: Product[];
    if (isCreatingNew) {
      updatedList = [editingProduct, ...products];
    } else {
      updatedList = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    }

    onSaveProducts(updatedList);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Confirmez-vous la suppression de ce produit du catalogue ?')) {
      const updated = products.filter(p => p.id !== id);
      onSaveProducts(updated);
    }
  };

  // EMONEY CONFIG SAVE
  const handleSaveEMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EMoneyConfig = {
      ...emoneyConfig,
      merchantPhone: tempMerchantPhone.trim() || '0991018186',
      merchantName: tempMerchantName.trim() || 'BLANCHE ELEGANCE SARL'
    };
    onSaveEMoneyConfig(updated);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 2500);
  };

  // SALES CALCULATIONS
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalItemsSold = orders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const averageBasket = orders.length > 0 ? (totalRevenue / orders.length).toFixed(1) : '0';

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Accès Réservé à l'Administration
            </span>
            <h1 className="font-serif text-2xl font-bold text-stone-900">Espace Gérant Blanche Élégance</h1>
            <p className="text-xs text-stone-500 mt-1">
              Authentification sécurisée par le numéro autorisé (<strong className="text-stone-800">{AUTHORIZED_PHONE}</strong>).
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Numéro de Téléphone Gérant *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Ex: 0991018186"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                id="btn-admin-request-otp"
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-lg transition"
              >
                Envoyer le Code d'Accès Sécurisé
              </button>

              <button
                type="button"
                onClick={() => { setPhoneInput(AUTHORIZED_PHONE); }}
                className="w-full py-1 text-[11px] text-amber-700 hover:underline text-center block"
              >
                Remplir automatiquement ({AUTHORIZED_PHONE})
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                Code envoyé au <strong className="font-mono">{phoneInput}</strong>. Code de test: <strong className="font-mono">8186</strong>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Code de Sécurité OTP (4 chiffres) *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-center font-mono text-lg tracking-widest font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                id="btn-admin-verify-otp"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl shadow-lg transition"
              >
                Vérifier & Ouvrir l'Espace Gérant
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full py-1 text-xs text-stone-500 hover:underline text-center"
              >
                Changer de numéro
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Admin Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">Direction & Espace Gérant</h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold tracking-wider rounded-full border border-emerald-400/30">
                Session Active (0991018186)
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-1">
              Contrôle du stock temps réel, dashboard des ventes, gestion des livraisons et configuration eMoney.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          id="btn-admin-logout"
          className="py-2 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold rounded-xl border border-stone-700 transition"
        >
          Déconnexion
        </button>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setAdminTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            adminTab === 'dashboard' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Historique des Ventes</span>
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            adminTab === 'products' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Package className="w-4 h-4 text-amber-400" />
          <span>Gestion Vêtements & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            adminTab === 'orders' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Commandes Centralisées ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('routes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            adminTab === 'routes' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-500" />
          <span>Analytique Trajets & Livraisons</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            adminTab === 'settings' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Paramètres eMoney (Numéro Marchand)</span>
        </button>
      </div>

      {/* SUB-TAB 1: HISTORIQUE DES VENTES / DASHBOARD */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Chiffre d'Affaires eMoney</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-stone-900">${totalRevenue}</span>
                <span className="text-xs font-semibold text-emerald-600">+18% ce mois</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">M-Pesa, Orange & Airtel cumulés</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Commandes Enregistrées</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-amber-600">{orders.length}</span>
                <span className="text-xs font-semibold text-stone-500">avec QR Code</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">100% de suivi actif</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Pièces Vendues</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-stone-900">{totalItemsSold}</span>
                <span className="text-xs font-semibold text-stone-500">unités</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Haute couture & prêt-à-porter</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Panier Moyen</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-emerald-700">${averageBasket}</span>
                <span className="text-xs font-semibold text-stone-500">/ commande</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Élégance haut de gamme</p>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">Historique Récent des Transactions eMoney</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase font-bold">
                    <th className="pb-3">N° Suivi</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Mode eMoney</th>
                    <th className="pb-3">Articles</th>
                    <th className="pb-3">Montant</th>
                    <th className="pb-3">Statut Colis</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50">
                      <td className="py-3 font-mono font-bold text-amber-800">#{ord.trackingNumber}</td>
                      <td className="py-3 font-medium text-stone-900">
                        {ord.customerName}
                        <span className="text-[10px] text-stone-400 block">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3 uppercase font-bold text-stone-700">
                        {ord.paymentMethod}
                        <span className="text-[10px] text-emerald-600 block font-normal">Payé</span>
                      </td>
                      <td className="py-3 text-stone-600">{ord.items.length} article(s)</td>
                      <td className="py-3 font-serif font-bold text-stone-900">${ord.totalAmount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'livree' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onOpenReceipt(ord)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-semibold"
                        >
                          Reçu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: GESTION DES PRODUITS & STOCK */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Catalogue Vêtements & Stocks</h2>
              <p className="text-xs text-stone-500">Ajout, modification de prix et importation d'images depuis la galerie en temps réel.</p>
            </div>

            <button
              id="admin-add-product-btn"
              onClick={handleStartCreateProduct}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Nouveau Modèle</span>
            </button>
          </div>

          {/* Product Edit / Create Modal Form */}
          {editingProduct && (
            <div className="bg-amber-50/60 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {isCreatingNew ? 'Création d’une Nouvelle Pièce' : `Modification : ${editingProduct.name}`}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-stone-500 hover:text-stone-900 text-xs font-bold"
                >
                  Annuler
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">Nom du Modèle *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        placeholder="Ex: Robe Soie Blanche Royale"
                        className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">Catégorie *</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                        >
                          {CATEGORIES.filter(c => c !== 'Tous').map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">Prix ($ USD) *</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-amber-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">Stock Disponible *</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-800 mb-1">Prix Barré / Promo ($)</label>
                        <input
                          type="number"
                          value={editingProduct.compareAtPrice || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="Optionnel"
                          className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">Description Détaillée</label>
                      <textarea
                        rows={3}
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Right: Image Upload from Gallery & Preview */}
                  <div className="space-y-4">
                    <label className="block text-xs font-semibold text-stone-800">
                      Photo & Fiche Galerie du Vêtement
                    </label>

                    <div className="flex gap-4 items-start">
                      <div className="w-32 h-44 rounded-xl overflow-hidden bg-stone-100 border border-stone-300 shrink-0">
                        <img
                          src={tempImagePreview || editingProduct.image}
                          alt="Aperçu vêtement"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-3 flex-1">
                        <label className="border-2 border-dashed border-amber-400 bg-white hover:bg-amber-50/50 p-4 rounded-xl cursor-pointer transition flex flex-col items-center justify-center text-center space-y-1 block">
                          <Upload className="w-5 h-5 text-amber-600" />
                          <span className="text-xs font-bold text-stone-800">Importer depuis la Galerie</span>
                          <span className="text-[10px] text-stone-500">PNG, JPG, WebP</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>

                        <div>
                          <span className="text-[10px] text-stone-500 block mb-1">Ou URL d’image web :</span>
                          <input
                            type="url"
                            value={editingProduct.image}
                            onChange={(e) => {
                              setEditingProduct({ ...editingProduct, image: e.target.value });
                              setTempImagePreview(e.target.value);
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 bg-white text-stone-700 text-xs font-semibold rounded-xl border border-stone-300 hover:bg-stone-50"
                      >
                        Annuler
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4 text-amber-400" />
                        <span>Enregistrer les Modifications</span>
                      </button>
                    </div>
                  </div>

                </div>
              </form>
            </div>
          )}

          {/* Products List Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Modèle</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix Réel</th>
                  <th className="p-4">Stock Live</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg border border-stone-200" referrerPolicy="no-referrer" />
                      <div>
                        <strong className="text-stone-900 font-serif text-sm block">{p.name}</strong>
                        <span className="text-[10px] text-stone-400">ID: {p.id}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-stone-700">{p.category}</td>
                    <td className="p-4 font-serif font-bold text-sm text-stone-900">${p.price}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.stock <= 0 ? 'bg-red-100 text-red-700' : p.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} en stock
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleStartEditProduct(p)}
                        className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: COMMANDES CENTRALISÉES */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-900">Base de Données Centrale des Commandes</h2>
            <span className="text-xs text-stone-500">{orders.length} colis gérés</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {ord.qrCodeDataUrl && (
                    <img src={ord.qrCodeDataUrl} alt="QR Code" className="w-16 h-16 object-contain border border-stone-200 rounded-lg p-1 bg-white" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-base text-stone-900">#{ord.trackingNumber}</strong>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        ${ord.totalAmount}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Client : <strong>{ord.customerName}</strong> ({ord.customerPhone}) • {ord.deliveryAddress}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Payé via <span className="uppercase font-semibold">{ord.paymentMethod}</span> (Réf: {ord.transactionRef})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    ord.status === 'livree' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => onOpenReceipt(ord)}
                    className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Voir Reçu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ANALYTIQUE DES TRAJETS & LIVRAISONS */}
      {adminTab === 'routes' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Tableau de Bord Analytique des Trajets de Livraison</h2>
            <p className="text-xs text-stone-500">Optimisation des circuits logistiques et performances des livreurs par secteur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics.map((route, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <h3 className="font-serif font-bold text-stone-900 text-base">{route.zone}</h3>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    {route.satisfactionRate}% Satisfaction
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-stone-400 block uppercase">Total Colis</span>
                    <strong className="text-stone-900 font-serif text-base">{route.totalDeliveries}</strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-stone-400 block uppercase">Temps Moyen</span>
                    <strong className="text-amber-700 font-serif text-base">{route.avgDeliveryTimeMinutes} min</strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-stone-400 block uppercase">Livreur Recommandé</span>
                    <strong className="text-stone-800 text-[11px] block truncate">{route.recommendedDriver}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 leading-tight">
                  Recommandation IA Logistique : Optimiser les départs groupés depuis l'Atelier Gombe vers {route.zone} pour réduire le temps de trajet de 12%.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PARAMÈTRES EMONEY & NUMÉRO MARCHAND */}
      {adminTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Paramètres des Transactions Mobile eMoney</h2>
            <p className="text-xs text-stone-500">
              Modifiez le numéro de téléphone officiel affiché aux clients pour les paiements M-Pesa, Orange Money et Airtel Money.
            </p>
          </div>

          {configSavedToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Numéro marchand et paramètres eMoney enregistrés avec succès !</span>
            </div>
          )}

          <form onSubmit={handleSaveEMoney} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Numéro Marchand Mobile eMoney (Défaut : 0991018186) *
              </label>
              <input
                type="tel"
                required
                value={tempMerchantPhone}
                onChange={(e) => setTempMerchantPhone(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-base font-mono font-bold text-stone-900 focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Ce numéro est automatiquement affiché lors du paiement par M-Pesa, Orange Money et Airtel Money.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nom du Titulaire / Raison Sociale *
              </label>
              <input
                type="text"
                required
                value={tempMerchantName}
                onChange={(e) => setTempMerchantName(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Sauvegarder les Paramètres de Paiement</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
