'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProductCategory, Retailer } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface FilterSidebarProps {
  categories: { name: ProductCategory; slug: string }[];
  retailers: Retailer[];
}

export default function FilterSidebar({ categories, retailers }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (type: 'category' | 'retailer' | 'sort', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (type === 'category') {
      if (current.get('category') === value) {
        current.delete('category');
      } else {
        current.set('category', value);
      }
    }

    // Placeholder for more complex retailer & sort logic
    if (type === 'sort') {
      current.set('sort', value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`/search${query}`);
  };

  const selectedCategory = searchParams.get('category');
  const selectedSort = searchParams.get('sort') || 'price-asc';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Ordenar por</h3>
        <Select value={selectedSort} onValueChange={(value) => handleFilterChange('sort', value)}>
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

      <Accordion type="multiple" defaultValue={['category', 'retailer']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-lg font-semibold">Categoría</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.slug} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category.slug}`}
                    checked={selectedCategory === category.name}
                    onCheckedChange={() => handleFilterChange('category', category.name)}
                  />
                  <Label htmlFor={`cat-${category.slug}`} className="font-normal cursor-pointer">
                    {category.name}
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
                  <Checkbox id={`ret-${retailer.id}`} />
                  <Label htmlFor={`ret-${retailer.id}`} className="font-normal cursor-pointer">
                    {retailer.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="w-full" onClick={() => router.push('/search')}>
        Limpiar filtros
      </Button>
    </div>
  );
}

FilterSidebar.Skeleton = function FilterSidebarSkeleton() {
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
