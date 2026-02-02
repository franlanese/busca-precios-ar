import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import ProductSearchBar from '@/components/product-search-bar';
import Logo from "@/app/icon.png"
import { categories as sharedCategories } from '@/lib/data';
import { ProductCategory } from '@/lib/types';
import { LucideIcon } from 'lucide-react';

const categoryIcons: Record<ProductCategory, LucideIcon> = {
  celulares: Icons.smartphone,
  televisores: Icons.tv,
  consolas: Icons.console,
  notebook: Icons.logo, // Fallback icon, maybe add Laptop icon later
  accesorios: Icons.audio,
};

const categories = sharedCategories.map((cat) => ({
  name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
  slug: cat.slug,
  icon: categoryIcons[cat.name as ProductCategory] || Icons.search,
  href: `/search?category=${cat.slug}`,
}));

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="flex flex-col items-center text-center">
        <img src={Logo.src} className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary font-headline">
          Busca Precios
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground">
          Tu metabuscador de electrodomésticos en Argentina. Encontrá el mejor
          precio, siempre.
        </p>
        <div className="mt-8 w-full max-w-2xl">
          <ProductSearchBar />
        </div>
        <div className="mt-10">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            O explorá por categoría:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="secondary"
                asChild
                className="transform transition-transform hover:scale-105"
              >
                <Link href={category.href}>
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
