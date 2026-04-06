'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';

function SearchBarContent({
  initialQuery = '',
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingFiltersRef = useRef<{sort: string, selectedStores: string[], selectedCategories: string[]} | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleFilters = (e: CustomEvent) => {
      pendingFiltersRef.current = e.detail;
    };
    window.addEventListener('pending-filters-changed', handleFilters as EventListener);
    return () => window.removeEventListener('pending-filters-changed', handleFilters as EventListener);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (pendingFiltersRef.current) {
      const { sort, selectedStores, selectedCategories } = pendingFiltersRef.current;
      
      if (sort && sort !== 'price-asc') params.set('sort', sort);
      else params.delete('sort');
      
      if (selectedStores && selectedStores.length > 0) params.set('store', selectedStores.join(','));
      else params.delete('store');
      
      if (selectedCategories && selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
      else params.delete('category');
    }
    
    if (query.trim()) {
      params.set('q', query.trim());
      router.push(`/search?${params.toString()}`);
    } else {
      params.delete('q');
      // If there is a category, we want to reload search without 'q'.
      // If there is no category, we do not perform the search to prevent errors.
      if (params.has('category')) {
        router.push(`/search?${params.toString()}`);
      }
    } 
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
      <div className="relative w-full">
        <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar celulares, televisores, consolas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>
      <Button type="submit" size="lg" className="h-12">
        <span className="hidden sm:inline">Buscar</span>
        <Icons.search className="h-5 w-5 sm:hidden" />
      </Button>
    </form>
  );
}

export default function ProductSearchBar(props: { initialQuery?: string }) {
  return (
    <Suspense fallback={
      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full h-12 bg-muted/20 animate-pulse rounded-md" />
        <div className="h-12 w-24 bg-muted/20 animate-pulse rounded-md hidden sm:block" />
      </div>
    }>
      <SearchBarContent {...props} />
    </Suspense>
  );
}
