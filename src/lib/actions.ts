'use server';

import { products as localProducts, prices, retailers, priceHistories, categories as allCategories } from './data';
import type { Product, Price, Retailer, PriceHistoryPoint, ProductCategory, ProductOfferSearchResult } from './types';

export async function searchProducts(
  query: string,
  categories?: ProductCategory[],
  sortOption: string = 'price-asc'
): Promise<ProductOfferSearchResult[]> {

  const params = new URLSearchParams({
    q: query
  })

  if (categories?.length) {
    const normalized = categories.map(c => c.toLowerCase());
    params.append('category', normalized.join(','))
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?${params}`)

  if (!res.ok) {
    const text = await res.text()
    console.error('Search error: ', {
      status: res.status,
      statusText: res.statusText,
      body: text,
    })

    throw new Error('Error al buscar productos')
  }

  let searchResults = await res.json() as ProductOfferSearchResult[]

  if (sortOption === 'price-asc') {
    searchResults.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    searchResults.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'relevance') {
    searchResults.sort((a, b) => b.score - a.score);
  }

  // Enrich with categories if not present
  searchResults = searchResults.map(result => {
    if (!result.category) {
      // Find matching product in local data to get category
      const matchedProduct = localProducts.find(p => p.id === result.id || p.name === result.title);
      if (matchedProduct) {
        return {
          ...result,
          category: matchedProduct.category
        };
      }
    }
    return result;
  });

  if (categories?.length) {
    const normalizedCategories = categories.map(c => c.toLowerCase());
    searchResults = searchResults.filter(result =>
      result.category && normalizedCategories.includes(result.category.toLowerCase())
    );
  }

  return searchResults;

  /*
  if (query) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  */

  /*
  // Flatten results: Product * Retailers
  const results: ProductOfferSearchResult[] = [];

  filteredProducts.forEach((product) => {
    const productPrices = prices.filter((p) => p.productId === product.id);

    productPrices.forEach((price) => {
      const retailer = retailers.find(r => r.id === price.retailerId);
      if (retailer) {
        results.push({
          ...product,
          retailerName: retailer.name,
          retailerLogo: retailer.logoUrl,
          price: price.price,
          offerUrl: price.url,
        });
      }
    });
  });
  */

}

export interface ProductDetails {
  product: Product;
  prices: (Price & { retailer: Retailer })[];
  priceHistory: PriceHistoryPoint[];
}

export async function getProductDetails(slug: string): Promise<ProductDetails | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const product = localProducts.find((p) => p.slug === slug);

  if (!product) {
    return null;
  }

  const productPrices = prices
    .filter((p) => p.productId === product.id)
    .map((price) => {
      const retailer = retailers.find((r) => r.id === price.retailerId)!;
      return { ...price, retailer };
    })
    .sort((a, b) => a.price - b.price);

  const history = priceHistories[product.id] || [];

  return {
    product,
    prices: productPrices,
    priceHistory: history,
  };
}

export async function getRetailers() {
  return retailers;
}

export async function getCategories() {
  return allCategories;
}

export async function setPriceAlert(formData: FormData): Promise<{ success: boolean; message: string }> {
  const email = formData.get('email');
  const price = formData.get('price');
  const productId = formData.get('productId');

  if (!email || !price || !productId) {
    return { success: false, message: 'Faltan datos para crear la alerta.' };
  }

  console.log(`Alerta de precio creada para producto ${productId}:
    - Email: ${email}
    - Precio máximo: ${price}`);

  // In a real app, you would save this to a database
  // and set up a cron job to check prices.

  return { success: true, message: '¡Alerta de precio creada! Te avisaremos por email.' };
}
