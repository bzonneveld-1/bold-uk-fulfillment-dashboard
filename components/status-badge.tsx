interface StatusBadgeProps {
  status: 'ok' | 'soon' | 'urgent' | 'out_of_stock';
}

const styles = {
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  soon: 'bg-amber-50 text-amber-700 border-amber-200',
  urgent: 'bg-red-50 text-red-600 border-red-200',
  out_of_stock: 'bg-neutral-50 text-neutral-500 border-neutral-200',
};

const labels = {
  ok: 'OK',
  soon: 'Low',
  urgent: 'Urgent',
  out_of_stock: 'Out of Stock',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
