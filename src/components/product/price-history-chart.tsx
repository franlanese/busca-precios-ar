'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { PriceHistoryPoint } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { ChartTooltipContent } from '@/components/ui/chart';

interface PriceHistoryChartProps {
  data: PriceHistoryPoint[];
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const chartData = data.map(item => ({
    ...item,
    date: parseISO(item.date),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => format(value, 'MMM', { locale: es })}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${formatCurrency(value).replace('$', '').slice(0, -3)}k`}
        />
        <Tooltip
            cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
            content={({ active, payload, label }) => {
                if(active && payload && payload.length) {
                    return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-1 gap-1.5">
                                <span className="text-sm text-muted-foreground">{format(label, 'PPP', { locale: es })}</span>
                                <span className="font-bold text-primary">{formatCurrency(payload[0].value as number)}</span>
                            </div>
                        </div>
                    )
                }
                return null;
            }}
        />
        <Bar dataKey="price" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
