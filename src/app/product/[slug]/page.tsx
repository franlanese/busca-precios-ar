import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductDetails } from '@/lib/actions';
import { aggregateProductDetails } from '@/ai/flows/aggregate-product-details';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/shared/icons';
import RetailerPriceTable from '@/components/product/retailer-price-table';
import PriceHistoryChart from '@/components/product/price-history-chart';
import PriceAlertForm from '@/components/product/price-alert-form';
import ProductDetailsAI from '@/components/product/product-details-ai';

export const revalidate = 3600; // Revalidate every hour

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getProductDetails(params.slug);

  if (!data) {
    notFound();
  }

  const { product, prices, priceHistory } = data;
  const aiDetails = await aggregateProductDetails({ productName: product.name });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
            <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                data-ai-hint={product.imageHint}
            />
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight font-headline">
              {product.name}
            </h1>
          </div>
          
          <RetailerPriceTable prices={prices} />
          
          <PriceAlertForm productId={product.id} />
        </div>
      </div>
      
      <Separator className="my-8 lg:my-12" />

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2 space-y-8">
            <ProductDetailsAI details={aiDetails.details} />
        </div>
        <div className="md:col-span-1 space-y-8">
            <section>
                <h2 className="text-2xl font-bold flex items-center mb-4">
                    <Icons.trendingUp className="mr-3 h-6 w-6 text-primary" />
                    Historial de Precios
                </h2>
                <div className="h-64 rounded-lg bg-card p-4 shadow-sm">
                    {priceHistory.length > 0 ? (
                        <PriceHistoryChart data={priceHistory} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No hay historial de precios disponible.
                        </div>
                    )}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
