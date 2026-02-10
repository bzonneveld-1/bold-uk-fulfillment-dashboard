interface StatusBadgeProps {
  status: 'ok' | 'soon' | 'urgent' | 'out_of_stock';
}

const styles = {
  ok: 'bg-green-100 text-green-800',
  soon: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
  out_of_stock: 'bg-gray-100 text-gray-800',
};

const labels = {
  ok: 'OK',
  soon: 'Low',
  urgent: 'Urgent',
  out_of_stock: 'Out of Stock',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
