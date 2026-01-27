import { Suspense } from 'react';
import ProductSearchBar from '@/components/product-search-bar';
import { searchProducts } from '@/lib/actions';
import FilterSidebar, { FilterSidebarSkeleton } from '@/components/search/filter-sidebar';
import ProductCard from '@/components/search/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import type { ProductOfferSearchResult, Retailer } from '@/lib/types';
import { stores } from '@/lib/stores';

export const revalidate = 0; // No caching for search results

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'price-asc';
  const store = typeof searchParams?.store === 'string' ? searchParams.store : undefined;

  // Initiate search request
  const offersPromise = searchProducts(query, category, sort);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <ProductSearchBar initialQuery={query} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Suspense fallback={<FilterSidebarSkeleton />}>
            <FilterSidebar retailers={stores} />
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

async function FilterSidebarLoader({ offersPromise }: { offersPromise: Promise<ProductOfferSearchResult[]> }) {
  // Para este ejemplo usaremos la lista estática que creaste
  // en lugar de calcularla desde los resultados
  // const offers = await offersPromise;
  // const uniqueStores = Array.from(new Set(offers.map(offer => offer.store)));
  // ... (código anterior comentado o eliminado)

  return <FilterSidebar retailers={stores} />;
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
