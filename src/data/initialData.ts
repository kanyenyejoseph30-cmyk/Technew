import { Product, Order, EMoneyConfig, DeliveryRouteAnalytic } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Robe Soie Blanche Élégance',
    description: 'Robe longue en soie satinée blanche avec encolure délicate et dos nu raffiné. Idéale pour les réceptions prestigieuses.',
    category: 'Robes',
    price: 280,
    compareAtPrice: 340,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blanc Pur', 'Ivoire', 'Champagne'],
    isFeatured: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'prod-2',
    name: 'Costume Sur-Mesure Blanc Cassé',
    description: 'Ensemble blazer cintré et pantalon à pinces ajusté en laine vierge d’Italie. Élégance intemporelle pour hommes distingués.',
    category: 'Costumes & Vestes',
    price: 450,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['48', '50', '52', '54'],
    colors: ['Blanc Cassé', 'Gris Perle', 'Noir Royal'],
    isFeatured: true,
    createdAt: '2026-08-02'
  },
  {
    id: 'prod-3',
    name: 'Chemise en Popeline Blanche Royale',
    description: 'Chemise ajustée 100% coton égyptien avec col français et poignets mousquetaires. Confort respirant et repassage facile.',
    category: 'Chemises & Tops',
    price: 110,
    compareAtPrice: 140,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc Neige', 'Bleu Ciel'],
    isFeatured: false,
    createdAt: '2026-08-03'
  },
  {
    id: 'prod-4',
    name: 'Abaya Luxueuse Blanche à Broderies Dorées',
    description: 'Abaya fluide haut de gamme agrémentée de broderies artisanales faites main aux fil d’or sur les manches et l’ourlet.',
    category: 'Manteaux & Abayas',
    price: 320,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S/M', 'L/XL'],
    colors: ['Blanc & Or', 'Blanc & Argent'],
    isFeatured: true,
    createdAt: '2026-08-04'
  },
  {
    id: 'prod-5',
    name: 'Manteau en Cachemire Crème',
    description: 'Manteau long ceinturé en pur cachemire double face. Douceur incomparable et allure majestueuse pour les journées fraîches.',
    category: 'Manteaux & Abayas',
    price: 520,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Crème', 'Camel', 'Blanc'],
    isFeatured: false,
    createdAt: '2026-08-05'
  },
  {
    id: 'prod-6',
    name: 'Escarpins Satinés Blancs Crystal',
    description: 'Escarpins à talons aiguilles de 8.5cm ornés d’une boucle bijou étincelante. La touche d’éclat finale de votre tenue.',
    category: 'Chaussures',
    price: 210,
    compareAtPrice: 260,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['37', '38', '39', '40'],
    colors: ['Blanc', 'Nude'],
    isFeatured: false,
    createdAt: '2026-08-06'
  },
  {
    id: 'prod-7',
    name: 'Sac à Main Cuir Vernis Blanc & Or',
    description: 'Sac de créateur en cuir d’agneau matelassé avec fermeture dorée signature et chaîne ajustable.',
    category: 'Accessoires',
    price: 290,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Unique'],
    colors: ['Blanc Pureté', 'Noir Doré'],
    isFeatured: true,
    createdAt: '2026-08-07'
  },
  {
    id: 'prod-8',
    name: 'Robe Cocktail Plissée Ivoire',
    description: 'Robe mi-longue plissée avec ceinture marquante à la taille. Coupe vaporeuse et silhouette éthérée.',
    category: 'Robes',
    price: 240,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Ivoire', 'Poudre de Rose'],
    isFeatured: false,
    createdAt: '2026-08-08'
  }
];

export const INITIAL_EMONEY_CONFIG: EMoneyConfig = {
  merchantPhone: '0991018186',
  merchantName: 'BLANCHE ELEGANCE SARL',
  mpesaActive: true,
  orangeActive: true,
  airtelActive: true,
  exchangeRate: 2850
};

export const DEFAULT_EMONEY_CONFIG = INITIAL_EMONEY_CONFIG;

export const INITIAL_ANALYTICS: DeliveryRouteAnalytic[] = [
  { zone: 'Kinshasa - Gombe / Centre-Ville', totalDeliveries: 142, avgDeliveryTimeMinutes: 28, satisfactionRate: 98.5, recommendedDriver: 'Jean-Luc Express' },
  { zone: 'Kinshasa - Ngaliema / Mont-Fleury', totalDeliveries: 98, avgDeliveryTimeMinutes: 35, satisfactionRate: 97.2, recommendedDriver: 'Patrick M-Express' },
  { zone: 'Kinshasa - Limete / Industrielle', totalDeliveries: 64, avgDeliveryTimeMinutes: 42, satisfactionRate: 95.8, recommendedDriver: 'Marc K. Livreur' },
  { zone: 'Lubumbashi - Golf / Centre', totalDeliveries: 53, avgDeliveryTimeMinutes: 30, satisfactionRate: 99.0, recommendedDriver: 'Alain Swift' }
];

export const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    trackingNumber: 'BE-2026-9812',
    customerName: 'Marie-Louise Kalala',
    customerPhone: '0812345678',
    customerEmail: 'marielouise@example.com',
    deliveryAddress: 'Avenue de la Justice, Immeuble Horizon, Apt 4B, Gombe, Kinshasa',
    deliveryType: 'domicile',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Blanc Pur'
      }
    ],
    totalAmount: 280,
    paymentMethod: 'mpesa',
    paymentPhone: '0812345678',
    paymentStatus: 'paye',
    transactionRef: 'MP20260812-88741',
    status: 'en_transit',
    qrCodeDataUrl: '',
    createdAt: '2026-08-12T14:30:00Z',
    updatedAt: '2026-08-12T16:10:00Z',
    estimatedDelivery: '2026-08-13T11:00:00Z',
    driverName: 'Jean-Luc Express',
    driverPhone: '0991018186',
    deliveryCoordinates: { lat: -4.303, lng: 15.301 },
    trackingHistory: [
      {
        status: 'en_attente',
        title: 'Commande enregistrée',
        description: 'Paiement de $280 validé via M-Pesa',
        location: 'Boutique Blanche Élégance Gombe',
        timestamp: '12 Août, 14:30',
        isCompleted: true
      },
      {
        status: 'validee',
        title: 'Preparation du colis',
        description: 'Vêtement emballé sous housse de protection hermétique',
        location: 'Atelier de préparation Blanche Élégance',
        timestamp: '12 Août, 15:00',
        isCompleted: true
      },
      {
        status: 'prise_en_charge',
        title: 'Scanné & Pris en charge par le livreur',
        description: 'Colis confié à Jean-Luc Express (0991018186)',
        location: 'Centre Logistique Blanche Élégance',
        timestamp: '12 Août, 16:10',
        isCompleted: true
      },
      {
        status: 'en_transit',
        title: 'En cours d’acheminement',
        description: 'Livreur en route vers la destination',
        location: 'En cours de déplacement vers Gombe',
        timestamp: '12 Août, 16:45',
        isCompleted: true
      },
      {
        status: 'pret_retrait',
        title: 'Arrivée imminente',
        description: 'Le livreur est dans votre secteur',
        location: 'Proximité Av. Justice',
        timestamp: 'Prévu vers 17:30',
        isCompleted: false
      },
      {
        status: 'livree',
        title: 'Livraison confirmée',
        description: 'Scan du QR code client effectué',
        location: 'Adresse du client',
        timestamp: 'En attente',
        isCompleted: false
      }
    ]
  }
];
