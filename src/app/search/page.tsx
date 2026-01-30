import { Suspense } from 'react';
import ProductSearchBar from '@/components/product-search-bar';
import { searchProducts } from '@/lib/actions';
import FilterSidebar, { FilterSidebarSkeleton } from '@/components/search/filter-sidebar';
import ProductCard from '@/components/search/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import type { ProductCategory, ProductOfferSearchResult, Retailer } from '@/lib/types';
import { stores } from '@/lib/stores';
import { categories as allCategories} from '@/lib/data';

export const revalidate = 0; // No caching for search results

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    console.log('RAW PARAMS: ', params)

    const query =
      typeof params.q === 'string' ? params.q : '';

    const validCategories = allCategories.map(c => c.name) as ProductCategory[]
    let selectedCategories: ProductCategory[] | undefined;

    if (typeof params.category === 'string') {
      selectedCategories = params.category.split(',')
        .filter((c): c is ProductCategory => 
          validCategories.includes(c as ProductCategory))
      ;
    } else if (Array.isArray(params.category)) {
      selectedCategories = params.category
        .filter((c): c is ProductCategory => 
          validCategories.includes(c as ProductCategory)
        )
    }

    const sort =
      typeof params.sort === 'string' ? params.sort : 'price-asc';

    const store =
      typeof params.store === 'string' ? params.store : undefined;

    console.log('q, categories:', query, selectedCategories);

    const offersPromise = searchProducts(query, selectedCategories, sort);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <ProductSearchBar initialQuery={query} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Suspense fallback={<FilterSidebarSkeleton />}>
            <FilterSidebar retailers={stores} categories={allCategories.map(c => c.name)} />
          </Suspense>
        </aside>
        <main className="md:col-span-3">
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults offersPromise={offersPromise} query={query} store={store} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function SearchResults({ offersPromise, query, store }: { offersPromise: Promise<ProductOfferSearchResult[]>; query: string; store?: string }) {
  let offers = await offersPromise;

  // Apply store filter if present
  if (store) {
    const selectedStores = store.split(',');
    offers = offers.filter(offer => selectedStores.includes(offer.store));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {query ? `Resultados para "${query}"` : 'Todos los productos'}
        </h2>
        <span className="text-sm text-muted-foreground">{offers.length} resultados</span>
      </div>
      <Separator className="mb-6" />
      {offers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <ProductCard key={`${offer.id}-${offer.store}`} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold">No se encontraron productos</h3>
          <p className="text-muted-foreground mt-2">Intenta con otra búsqueda o modifica los filtros.</p>
        </div>
      )}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Separator className="mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ProductCard.Skeleton key={i} />
        ))}
      </div>
    </div>
  );
}
