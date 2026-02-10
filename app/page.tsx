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
        <h1 className="text-2xl font-bold">Stock Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bold products at NetXL warehouse &middot; Updated every 15 minutes
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard title="Bold SKUs" value={products.length} />
        <KpiCard title="In Stock" value={inStock} color="green" />
        <KpiCard title="Out of Stock" value={outOfStock} color={outOfStock > 0 ? 'red' : 'default'} />
        <KpiCard title="Low Stock Alerts" value={lowStockCount} color={lowStockCount > 0 ? 'orange' : 'default'} />
        <KpiCard title="Available Credit" value={`£${credit.available_credit.toFixed(2)}`} />
      </div>

      <div className="bg-white rounded-xl border shadow-sm mb-8">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Bold Products Stock</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-medium">SKU</th>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-right p-3 font-medium">Stock</th>
                <th className="text-right p-3 font-medium">Sold (30d)</th>
                <th className="text-right p-3 font-medium">Weeks Left</th>
                <th className="text-center p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item.sku} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{item.sku}</td>
                  <td className="p-3">{item.name.replace(/Bold (Smart Lock - |Smart Lock |Elite |Smart Door |Connect WiFi |)/, '')}</td>
                  <td className="p-3 text-right font-semibold">{item.currentStock}</td>
                  <td className="p-3 text-right">{item.soldLastMonth}</td>
                  <td className="p-3 text-right">
                    {item.weeksOfStockLeft !== null ? `${item.weeksOfStockLeft}w` : '-'}
                  </td>
                  <td className="p-3 text-center">
                    <StatusBadge status={item.urgency} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Stock Levels by SKU</h2>
        </div>
        <div className="p-5">
          <StockChart data={salesData} />
        </div>
      </div>
    </div>
  );
}
