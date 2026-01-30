import type { Product, Retailer, Price, PriceHistoryPoint, ProductCategory } from './types';

export const retailers: Retailer[] = [
  { id: 'mercadolibre', name: 'Mercado Libre', logoUrl: '/retailers/mercadolibre.svg' },
  { id: 'fravega', name: 'Fravega', logoUrl: '/retailers/fravega.svg' },
  { id: 'musimundo', name: 'Musimundo', logoUrl: '/retailers/musimundo.svg' },
  { id: 'cetrogar', name: 'Cetrogar', logoUrl: '/retailers/cetrogar.svg' },
];

export const products: Product[] = [
  { id: '1', slug: 'samsung-galaxy-s23', name: 'Samsung Galaxy S23', category: 'celulares', imageUrl: 'https://picsum.photos/seed/smartphone1/600/600', imageHint: 'smartphone device' },
  { id: '2', slug: 'sony-bravia-55', name: 'Sony Bravia 55" 4K', category: 'televisores', imageUrl: 'https://picsum.photos/seed/tv1/800/600', imageHint: 'television living room' },
  { id: '3', slug: 'playstation-5', name: 'PlayStation 5', category: 'consolas', imageUrl: 'https://picsum.photos/seed/console1/600/400', imageHint: 'game console' },
  { id: '4', slug: 'iphone-15', name: 'iPhone 15 Pro', category: 'celulares', imageUrl: 'https://picsum.photos/seed/smartphone2/600/600', imageHint: 'iphone alternative' },
  { id: '5', slug: 'lg-oled-65', name: 'LG OLED 65" Evo C3', category: 'televisores', imageUrl: 'https://picsum.photos/seed/tv2/800/600', imageHint: 'oled tv' },
  { id: '6', slug: 'xbox-series-x', name: 'Xbox Series X', category: 'consolas', imageUrl: 'https://picsum.photos/seed/console2/600/400', imageHint: 'xbox console' },
  { id: '7', slug: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5', category: 'accesorios', imageUrl: 'https://picsum.photos/seed/headphones1/600/600', imageHint: 'wireless headphones' },
];

export const prices: Price[] = [
  // Samsung Galaxy S23
  { productId: '1', retailerId: 'mercadolibre', price: 1250000, url: '#', lastUpdated: '2023-10-27T10:00:00Z' },
  { productId: '1', retailerId: 'fravega', price: 1280000, url: '#', lastUpdated: '2023-10-27T11:00:00Z' },
  { productId: '1', retailerId: 'musimundo', price: 1300000, url: '#', lastUpdated: '2023-10-27T09:00:00Z' },
  // Sony Bravia 55"
  { productId: '2', retailerId: 'fravega', price: 980000, url: '#', lastUpdated: '2023-10-27T10:00:00Z' },
  { productId: '2', retailerId: 'musimundo', price: 975000, url: '#', lastUpdated: '2023-10-27T11:00:00Z' },
  { productId: '2', retailerId: 'cetrogar', price: 990000, url: '#', lastUpdated: '2023-10-27T09:00:00Z' },
  // PlayStation 5
  { productId: '3', retailerId: 'mercadolibre', price: 1100000, url: '#', lastUpdated: '2023-10-27T10:00:00Z' },
  { productId: '3', retailerId: 'musimundo', price: 1150000, url: '#', lastUpdated: '2023-10-27T09:00:00Z' },
  // iPhone 15
  { productId: '4', retailerId: 'mercadolibre', price: 2100000, url: '#', lastUpdated: '2023-10-27T10:00:00Z' },
  // LG OLED 65"
  { productId: '5', retailerId: 'fravega', price: 1800000, url: '#', lastUpdated: '2023-10-27T10:00:00Z' },
  { productId: '5', retailerId: 'cetrogar', price: 1750000, url: '#', lastUpdated: '2023-10-27T09:00:00Z' },
  // Xbox Series X
  { productId: '6', retailerId: 'mercadolibre', price: 990000, url: '#', lastUpdated: '2023-10-27T10:00:00Z' },
  { productId: '6', retailerId: 'cetrogar', price: 1020000, url: '#', lastUpdated: '2023-10-27T09:00:00Z' },
  // Sony WH-1000XM5
  { productId: '7', retailerId: 'mercadolibre', price: 450000, url: '#', lastUpdated: '2023-10-27T10:00:00Z' },
  { productId: '7', retailerId: 'musimundo', price: 465000, url: '#', lastUpdated: '2023-10-27T09:00:00Z' },
];

export const priceHistories: Record<string, PriceHistoryPoint[]> = {
  '1': [
    { date: '2023-08-01', price: 1350000 },
    { date: '2023-08-15', price: 1320000 },
    { date: '2023-09-01', price: 1300000 },
    { date: '2023-09-15', price: 1310000 },
    { date: '2023-10-01', price: 1280000 },
    { date: '2023-10-15', price: 1250000 },
  ],
  '2': [
    { date: '2023-08-01', price: 1050000 },
    { date: '2023-08-15', price: 1020000 },
    { date: '2023-09-01', price: 1000000 },
    { date: '2023-09-15', price: 990000 },
    { date: '2023-10-01', price: 980000 },
    { date: '2023-10-15', price: 975000 },
  ],
  '3': [
    { date: '2023-08-01', price: 1200000 },
    { date: '2023-08-15', price: 1210000 },
    { date: '2023-09-01', price: 1180000 },
    { date: '2023-09-15', price: 1150000 },
    { date: '2023-10-01', price: 1120000 },
    { date: '2023-10-15', price: 1100000 },
  ],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
};

export const categories: { name: ProductCategory, slug: string }[] = [
  { name: 'celulares', slug: 'celulares' },
  { name: 'televisores', slug: 'televisores' },
  { name: 'consolas', slug: 'consolas' },
  { name: 'notebook', slug: 'notebooks' },
  { name: 'accesorios', slug: 'accesorios' }
];
