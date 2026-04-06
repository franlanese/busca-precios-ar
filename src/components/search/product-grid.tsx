'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ProductCard from '@/components/search/product-card';
import { Button } from '@/components/ui/button';
import { searchProducts } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { ProductOfferSearchResult, ProductCategory } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface ProductGridProps {
    initialOffers: ProductOfferSearchResult[];
    query: string;
    categories?: ProductCategory[];
    sort: string;
    store?: string;
    totalInitialCount: number; // Added to maybe show total count? Though API doesn't seem to return total count easily yet.
}

export default function ProductGrid({
    initialOffers,
    query,
    categories,
    sort,
    store
}: ProductGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [offers, setOffers] = useState<ProductOfferSearchResult[]>(initialOffers);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialOffers.length >= 12);

    const loadMore = async () => {
        setIsLoading(true);
        const nextPage = page + 1;

        try {
            let newOffers = await searchProducts(query, categories, sort, nextPage);

            // Client-side store filtering if needed (to match server-side behavior for initial load)
            // Ideally API handles this, but based on current implementation in page.tsx:
            if (store) {
                const selectedStores = store.split(',');
                newOffers = newOffers.filter(offer => selectedStores.includes(offer.store));
            }

            if (newOffers.length === 0) {
                setHasMore(false);
            } else {
                setOffers(prev => [...prev, ...newOffers]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Error loading more products:', error);
            // Optional: Show error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold">
                        {query ? `Resultados para "${query}"` : 'Todos los productos'}
                    </h2>
                    {query && categories && categories.length > 0 && (
                        <button 
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('q');
                                router.push(`${pathname}?${params.toString()}`);
                            }}
                            className="text-green-600 underline text-sm mt-1 hover:text-green-700 transition-colors text-left"
                        >
                            Ver todo en {categories.join(', ')}
                        </button>
                    )}
                </div>
                {/* Note: Total count here is only accurate for currently loaded items if we don't know total from API */}
                <span className="text-sm text-muted-foreground mt-1 whitespace-nowrap ml-4">{offers.length} resultados mostrados</span>
            </div>
            <Separator className="mb-6" />

            {offers.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offers.map((offer) => (
                            <ProductCard key={offer.id} offer={offer} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="mt-8 flex justify-center">
                            <Button
                                variant="secondary"
                                onClick={loadMore}
                                disabled={isLoading}
                                className="min-w-[200px]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cargando...
                                    </>
                                ) : (
                                    'Ver más productos'
                                )}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-lg font-semibold">No se encontraron productos</h3>
                    <p className="text-muted-foreground mt-2">Intenta con otra búsqueda o modifica los filtros.</p>
                </div>
            )}
        </div>
    );
}
