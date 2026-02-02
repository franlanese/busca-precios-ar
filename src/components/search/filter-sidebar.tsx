'use client';

import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProductCategory, Retailer } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface FilterSidebarProps {
  retailers: Retailer[];
  categories: string[];
}

const capitalize = (s: string) => {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function FilterSidebar({ retailers, categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial state from URL
  const initialSort = searchParams.get('sort') || 'price-asc';
  const initialStores = searchParams.get('store')?.split(',') || [];
  const initialCategories = searchParams.get('category')?.split(',') || [];

  const [sort, setSort] = useState(initialSort);
  const [selectedStores, setSelectedStores] = useState<string[]>(initialStores);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);

  // Sync with URL if it changes externally (e.g. back button)
  useEffect(() => {
    setSort(searchParams.get('sort') || 'price-asc');
    setSelectedStores(searchParams.get('store')?.split(',') || []);
    setSelectedCategories(searchParams.get('category')?.split(',') || []);
  }, [searchParams]);

  const hasChanges = () => {
    const currentSort = searchParams.get('sort') || 'price-asc';
    const currentStores = searchParams.get('store')?.split(',') || [];
    const currentCategories = searchParams.get('category')?.split(',') || [];

    if (sort !== currentSort) return true;

    if (selectedStores.length !== currentStores.length) return true;
    if (!selectedStores.every(s => currentStores.includes(s))) return true;

    if (selectedCategories.length !== currentCategories.length) return true;
    if (!selectedCategories.every(c => currentCategories.includes(c))) return true;

    return false;
  };

  const handleFilterChange = (type: 'retailer' | 'sort' | 'category', value: string) => {
    if (type === 'retailer') {
      setSelectedStores(prev =>
        prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
      );
    }

    if (type === 'category') {
      setSelectedCategories(prev =>
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
    }

    if (type === 'sort') {
      setSort(value);
    }
  };

  const applyFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (sort !== 'price-asc') {
      current.set('sort', sort);
    } else {
      current.delete('sort');
    }

    if (selectedStores.length > 0) {
      current.set('store', selectedStores.join(','));
    } else {
      current.delete('store');
    }

    if (selectedCategories.length > 0) {
      current.set('category', selectedCategories.join(','));
    } else {
      current.delete('category');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`/search${query}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Ordenar por</h3>
        <Select value={sort} onValueChange={(value) => handleFilterChange('sort', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar orden" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="multiple" defaultValue={['retailer', 'category']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-lg font-semibold">Categoría</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={selectedCategories.includes(category.toLowerCase())} // URL is usually lowercase
                    onCheckedChange={() => handleFilterChange('category', category.toLowerCase())}
                  />
                  <Label htmlFor={`cat-${category}`} className="font-normal cursor-pointer">
                    {capitalize(category)}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="retailer">
          <AccordionTrigger className="text-lg font-semibold">Tienda</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {retailers.map((retailer) => (
                <div key={retailer.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ret-${retailer.id}`}
                    checked={selectedStores.includes(retailer.name)}
                    onCheckedChange={() => handleFilterChange('retailer', retailer.name)}
                  />
                  <Label htmlFor={`ret-${retailer.id}`} className="font-normal cursor-pointer">
                    {retailer.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-2">
        <Button
          className={`w-full text-white transition-opacity duration-200 ${hasChanges()
            ? 'bg-green-600 hover:bg-green-700 opacity-100'
            : 'bg-green-600 opacity-50 cursor-not-allowed'
            }`}
          onClick={applyFilters}
          disabled={!hasChanges()}
        >
          Aplicar filtros
        </Button>

        {/*
        <Button variant="outline" className="w-full" onClick={() => router.push('/search')}>
          Limpiar filtros
        </Button>
        */}
      </div>
    </div>
  );
}

export function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

FilterSidebar.Skeleton = FilterSidebarSkeleton;
