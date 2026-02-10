interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'default' | 'green' | 'red' | 'orange';
}

const dotColor = {
  default: 'bg-neutral-300',
  green: 'bg-emerald-400',
  red: 'bg-red-400',
  orange: 'bg-amber-400',
};

export default function KpiCard({ title, value, subtitle, color = 'default' }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor[color]}`} />
        <p className="text-[12px] text-neutral-500 font-medium uppercase tracking-wide">{title}</p>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-neutral-900">{value}</p>
      {subtitle && <p className="text-[11px] text-neutral-400 mt-1">{subtitle}</p>}
    </div>
  );
}
