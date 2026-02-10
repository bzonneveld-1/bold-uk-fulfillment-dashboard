import { getBoldProducts, getOrders, getCredit } from '@/lib/netxl-api';
import { calculateSalesVelocity } from '@/lib/calculations';
import KpiCard from '@/components/kpi-card';
import StatusBadge from '@/components/status-badge';
import StockChart from '@/components/stock-chart';

export const revalidate = 900; // 15 minutes

export default async function StockOverviewPage() {
  const [products, orders, credit] = await Promise.all([
    getBoldProducts(),
    getOrders(),
    getCredit(),
  ]);

  const salesData = calculateSalesVelocity(products, orders);
  const inStock = products.filter((p) => p.availability.available > 0).length;
  const outOfStock = products.length - inStock;
  const lowStockCount = salesData.filter((s) => s.urgency === 'urgent' || s.urgency === 'soon').length;

  const sorted = [...salesData].sort((a, b) => {
    const urgencyOrder = { out_of_stock: 0, urgent: 1, soon: 2, ok: 3 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Stock Overview</h1>
        <p className="text-[13px] text-neutral-400 mt-1">
          Bold products at NetXL warehouse
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <KpiCard title="Bold SKUs" value={products.length} />
        <KpiCard title="In Stock" value={inStock} color="green" />
        <KpiCard title="Out of Stock" value={outOfStock} color={outOfStock > 0 ? 'red' : 'default'} />
        <KpiCard title="Low Stock" value={lowStockCount} color={lowStockCount > 0 ? 'orange' : 'default'} />
        <KpiCard title="Available Credit" value={`£${credit.available_credit.toFixed(2)}`} />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/80 mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-[14px] font-semibold text-neutral-900">Bold Products Stock</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">SKU</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Product</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Sold (30d)</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Weeks Left</th>
                <th className="text-center px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item.sku} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-[12px] text-neutral-500">{item.sku}</td>
                  <td className="px-5 py-3 text-neutral-700">{item.name.replace(/Bold (Smart Lock - |Smart Lock |Elite |Smart Door |Connect WiFi |)/, '')}</td>
                  <td className="px-5 py-3 text-right font-semibold text-neutral-900">{item.currentStock}</td>
                  <td className="px-5 py-3 text-right text-neutral-500">{item.soldLastMonth}</td>
                  <td className="px-5 py-3 text-right text-neutral-500">
                    {item.weeksOfStockLeft !== null ? `${item.weeksOfStockLeft}w` : '-'}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={item.urgency} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/80">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-[14px] font-semibold text-neutral-900">Stock Levels</h2>
        </div>
        <div className="p-5">
          <StockChart data={salesData} />
        </div>
      </div>
    </div>
  );
}
