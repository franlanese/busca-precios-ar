'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { setPriceAlert } from '@/lib/actions';
import { Icons } from '../shared/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un email válido.' }),
  price: z.coerce.number().positive({ message: 'El precio debe ser mayor a cero.' }),
  productId: z.string(),
});

interface PriceAlertFormProps {
  productId: string;
}

export default function PriceAlertForm({ productId }: PriceAlertFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      price: 0,
      productId: productId,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('price', values.price.toString());
    formData.append('productId', values.productId);

    const result = await setPriceAlert(formData);
    
    if (result.success) {
      toast({
        title: '¡Éxito!',
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Icons.alert className="mr-3 h-5 w-5 text-primary" />
          Crear Alerta de Precio
        </CardTitle>
        <CardDescription>
            Te avisaremos por email cuando el precio baje del que indiques.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avisarme si baja de...</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Icons.dollar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" placeholder="1.000.000" {...field} className="pl-8"/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creando alerta...' : 'Crear Alerta'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
