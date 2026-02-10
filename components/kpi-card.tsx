interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'default' | 'green' | 'red' | 'orange';
}

const colorMap = {
  default: 'bg-white',
  green: 'bg-green-50 border-green-200',
  red: 'bg-red-50 border-red-200',
  orange: 'bg-orange-50 border-orange-200',
};

export default function KpiCard({ title, value, subtitle, color = 'default' }: KpiCardProps) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${colorMap[color]}`}>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
