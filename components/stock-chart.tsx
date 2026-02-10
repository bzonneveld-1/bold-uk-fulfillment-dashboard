'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StockChartProps {
  data: {
    sku: string;
    currentStock: number;
    urgency: 'ok' | 'soon' | 'urgent' | 'out_of_stock';
  }[];
}

const COLORS = {
  ok: '#22c55e',
  soon: '#f97316',
  urgent: '#ef4444',
  out_of_stock: '#d1d5db',
};

export default function StockChart({ data }: StockChartProps) {
  const sorted = [...data]
    .filter((d) => d.currentStock > 0)
    .sort((a, b) => b.currentStock - a.currentStock);

  if (sorted.length === 0) return <p className="text-gray-400 text-sm">No stock data</p>;

  return (
    <ResponsiveContainer width="100%" height={Math.max(300, sorted.length * 28)}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 140, right: 20 }}>
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="sku"
          width={130}
          tick={{ fontSize: 11 }}
        />
        <Tooltip />
        <Bar dataKey="currentStock" name="Stock" radius={[0, 4, 4, 0]}>
          {sorted.map((entry) => (
            <Cell key={entry.sku} fill={COLORS[entry.urgency]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
