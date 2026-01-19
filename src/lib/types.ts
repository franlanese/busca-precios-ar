export type ProductCategory = 'Celulares' | 'Televisores' | 'Consolas' | 'Audio';

export interface Retailer {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  imageUrl: string;
  imageHint: string;
}

export interface Price {
  productId: string;
  retailerId: string;
  price: number;
  url: string;
  lastUpdated: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface ProductOfferSearchResult {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  store: string;
  image: string;
  url: string;
  score: number;
}
