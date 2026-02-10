'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SalesVelocityChartProps {
  data: Record<string, string | number>[];
  skus: string[];
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6'];

export default function SalesVelocityChart({ data, skus }: SalesVelocityChartProps) {
  if (data.length === 0) return <p className="text-gray-400 text-sm">No sales data</p>;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        {skus.map((sku, i) => (
          <Line
            key={sku}
            type="monotone"
            dataKey={sku}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
