import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { Price, Retailer } from '@/lib/types';
import Link from 'next/link';
import { Icons } from '../shared/icons';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface RetailerPriceTableProps {
  prices: (Price & { retailer: Retailer })[];
}

export default function RetailerPriceTable({ prices }: RetailerPriceTableProps) {
  if (prices.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        Actualmente no hay ofertas disponibles para este producto.
      </div>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center text-2xl">
                <Icons.dollar className="mr-3 h-6 w-6 text-primary" />
                Comparativa de Precios
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Tienda</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="w-[120px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {prices.map((price) => (
                <TableRow key={price.retailerId}>
                    <TableCell className="font-medium">{price.retailer.name}</TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary-foreground">
                    {formatCurrency(price.price)}
                    </TableCell>
                    <TableCell className="text-right">
                    <Button asChild>
                        <Link href={price.url} target="_blank" rel="noopener noreferrer">
                        Ir a la tienda
                        </Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
