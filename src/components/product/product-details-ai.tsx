import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/shared/icons';

interface ProductDetailsAIProps {
  details: string;
}

export default function ProductDetailsAI({ details }: ProductDetailsAIProps) {
  return (
    <Card className="bg-gradient-to-br from-card to-secondary/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Icons.sparkles className="mr-3 h-6 w-6 text-primary" />
          Análisis del Producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none text-card-foreground/90">
          {details.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
