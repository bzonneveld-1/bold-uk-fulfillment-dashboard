import { getBoldProducts, getOrders } from '@/lib/netxl-api';
import { calculateSalesVelocity, getMonthlySalesData } from '@/lib/calculations';
import KpiCard from '@/components/kpi-card';
import StatusBadge from '@/components/status-badge';
import SalesVelocityChart from '@/components/sales-velocity-chart';

export const revalidate = 900;

export default async function RestockReportPage() {
  const [products, orders] = await Promise.all([getBoldProducts(), getOrders()]);
  const salesData = calculateSalesVelocity(products, orders);
  const monthlySales = getMonthlySalesData(orders);

  const totalStock = salesData.reduce((sum, s) => sum + s.currentStock, 0);
  const soldLastMonth = salesData.reduce((sum, s) => sum + s.soldLastMonth, 0);
  const needsRestock = salesData.filter((s) => s.proposedRestockQty > 0).length;

  const sorted = [...salesData].sort((a, b) => {
    const urgencyOrder = { out_of_stock: 0, urgent: 1, soon: 2, ok: 3 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || b.proposedRestockQty - a.proposedRestockQty;
  });

  // Top SKUs for the velocity chart
  const topSkus = ['BOLD-SX-33', 'BOLD-CLICKER-SINGLE', 'BOLD-CONNECT', 'BOLD-SX-45', 'BOLD-SX-55'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Restock Report</h1>
        <p className="text-sm text-gray-500 mt-1">
          Report date: {new Date().toLocaleDateString('en-GB')} &middot; Based on {orders.length} historical orders
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Units in Stock" value={totalStock} />
        <KpiCard title="Sold Last 30 Days" value={soldLastMonth} />
        <KpiCard title="SKUs Needing Restock" value={needsRestock} color={needsRestock > 0 ? 'orange' : 'default'} />
        <KpiCard
          title="Urgent Restocks"
          value={salesData.filter((s) => s.urgency === 'urgent').length}
          color={salesData.some((s) => s.urgency === 'urgent') ? 'red' : 'default'}
        />
      </div>

      <div className="bg-white rounded-xl border shadow-sm mb-8">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Restock Recommendations</h2>
          <p className="text-xs text-gray-400 mt-1">Target: 8 weeks of supply per SKU</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-medium">SKU</th>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-right p-3 font-medium">Stock</th>
                <th className="text-right p-3 font-medium">Sold (30d)</th>
                <th className="text-right p-3 font-medium">Avg/Month</th>
                <th className="text-right p-3 font-medium">Weeks Left</th>
                <th className="text-right p-3 font-medium">Exp. Next Month</th>
                <th className="text-right p-3 font-medium font-bold">Restock Qty</th>
                <th className="text-center p-3 font-medium">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item.sku} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{item.sku}</td>
                  <td className="p-3 text-xs">{item.name.replace(/Bold (Smart Lock - |Smart Lock |Elite |Smart Door |Connect WiFi |)/, '')}</td>
                  <td className="p-3 text-right">{item.currentStock}</td>
                  <td className="p-3 text-right">{item.soldLastMonth}</td>
                  <td className="p-3 text-right">{item.avgMonthlySales}</td>
                  <td className="p-3 text-right">
                    {item.weeksOfStockLeft !== null ? `${item.weeksOfStockLeft}w` : '-'}
                  </td>
                  <td className="p-3 text-right">{item.expectedSalesNextMonth}</td>
                  <td className="p-3 text-right font-bold">
                    {item.proposedRestockQty > 0 ? item.proposedRestockQty : '-'}
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
          <h2 className="font-semibold">Sales Velocity (Monthly)</h2>
          <p className="text-xs text-gray-400 mt-1">Units sold per month for top SKUs</p>
        </div>
        <div className="p-5">
          <SalesVelocityChart data={monthlySales} skus={topSkus} />
        </div>
      </div>
    </div>
  );
}
