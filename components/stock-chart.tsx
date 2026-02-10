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
  ok: '#171717',
  soon: '#d97706',
  urgent: '#dc2626',
  out_of_stock: '#e5e5e5',
};

export default function StockChart({ data }: StockChartProps) {
  const sorted = [...data]
    .filter((d) => d.currentStock > 0)
    .sort((a, b) => b.currentStock - a.currentStock);

  if (sorted.length === 0) return <p className="text-neutral-400 text-[13px]">No stock data</p>;

  return (
    <ResponsiveContainer width="100%" height={Math.max(280, sorted.length * 26)}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 120, right: 20, top: 0, bottom: 0 }}>
        <XAxis type="number" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="sku"
          width={110}
          tick={{ fontSize: 11, fill: '#737373' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
          }}
        />
        <Bar dataKey="currentStock" name="Stock" radius={[0, 3, 3, 0]} barSize={16}>
          {sorted.map((entry) => (
            <Cell key={entry.sku} fill={COLORS[entry.urgency]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
