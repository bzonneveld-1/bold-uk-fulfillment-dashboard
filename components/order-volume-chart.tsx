'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface OrderVolumeChartProps {
  data: { month: string; orders: number }[];
}

export default function OrderVolumeChart({ data }: OrderVolumeChartProps) {
  if (data.length === 0) return <p className="text-neutral-400 text-[13px]">No order data</p>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
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
        <Bar dataKey="orders" name="Orders" fill="#171717" radius={[3, 3, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
