import { Suspense } from 'react';
import ProductSearchBar from '@/components/product-search-bar';
import { getCategories, getRetailers, searchProducts } from '@/lib/actions';
import FilterSidebar from '@/components/search/filter-sidebar';
import ProductCard from '@/components/search/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const revalidate = 0; // No caching for search results

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'price-asc';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <ProductSearchBar initialQuery={query} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Suspense fallback={<FilterSidebar.Skeleton />}>
            <FilterSidebarLoader />
          </Suspense>
        </aside>
        <main className="md:col-span-3">
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults query={query} category={category} sort={sort} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function SearchResults({ query, category, sort }: { query: string; category?: string; sort?: string }) {
  const offers = await searchProducts(query, category, sort);

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

async function FilterSidebarLoader() {
  const categories = await getCategories();
  const retailers = await getRetailers();
  return <FilterSidebar categories={categories} retailers={retailers} />;
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
