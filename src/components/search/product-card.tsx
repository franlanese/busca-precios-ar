import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { ProductOfferSearchResult } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface ProductCardProps {
  offer: ProductOfferSearchResult;
}

export default function ProductCard({ offer }: ProductCardProps) {
  console.log("offer: ", offer)
  return (
    <Card className="flex flex-col overflow-hidden h-full transition-shadow duration-300 hover:shadow-primary/20 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="block aspect-square relative">
          <img
            src={offer.image}
            alt={offer.title}
            //fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            //data-ai-hint={offer.imageHint}
          />
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold shadow-sm">
            {offer.store}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg leading-tight mb-1 line-clamp-2">
          {offer.title}
        </CardTitle>
        <CardDescription>{offer.brand}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2">
        <div className="w-full">
          <div className="flex justify-between items-end mb-1">
            <p className="text-xs text-muted-foreground">Vendido por</p>
            {offer.retailerLogo ? (
              <div className="relative h-6 w-20">
                <Image src={offer.retailerLogo} alt={offer.retailerName} fill className="object-contain object-right" />
              </div>
            ) : (
              <span className="text-sm font-medium">{offer.store}</span>
            )}
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(offer.price)}</p>
        </div>
        <Button asChild className="w-full mt-2">
          <a href={offer.url} target="_blank" rel="noopener noreferrer">Ver oferta</a>
        </Button>
      </CardFooter>
    </Card>
  );
}

ProductCard.Skeleton = function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-6 w-4/5 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2">
        <Skeleton className="h-4 w-1/4 mb-1" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-10 w-full mt-2" />
      </CardFooter>
    </Card>
  );
}
