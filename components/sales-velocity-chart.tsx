'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SalesVelocityChartProps {
  data: Record<string, string | number>[];
  skus: string[];
}

const COLORS = ['#171717', '#737373', '#a3a3a3', '#d4d4d4', '#404040'];

export default function SalesVelocityChart({ data, skus }: SalesVelocityChartProps) {
  if (data.length === 0) return <p className="text-neutral-400 text-[13px]">No sales data</p>;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#737373' }} />
        {skus.map((sku, i) => (
          <Line
            key={sku}
            type="monotone"
            dataKey={sku}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={1.5}
            dot={{ r: 2, fill: COLORS[i % COLORS.length] }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
