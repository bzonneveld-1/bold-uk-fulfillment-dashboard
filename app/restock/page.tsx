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

  const topSkus = ['BOLD-SX-33', 'BOLD-CLICKER-SINGLE', 'BOLD-CONNECT', 'BOLD-SX-45', 'BOLD-SX-55'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Restock Report</h1>
        <p className="text-[13px] text-neutral-400 mt-1">
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} &middot; Based on {orders.length} orders
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard title="Units in Stock" value={totalStock} />
        <KpiCard title="Sold (30 Days)" value={soldLastMonth} />
        <KpiCard title="Need Restock" value={needsRestock} color={needsRestock > 0 ? 'orange' : 'default'} />
        <KpiCard
          title="Urgent"
          value={salesData.filter((s) => s.urgency === 'urgent').length}
          color={salesData.some((s) => s.urgency === 'urgent') ? 'red' : 'default'}
        />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/80 mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-[14px] font-semibold text-neutral-900">Restock Recommendations</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">Target: 8 weeks of supply per SKU</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">SKU</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Product</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Sold (30d)</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Avg/Mo</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Weeks Left</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Exp. Next Mo</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-900 text-[11px] uppercase tracking-wider">Restock Qty</th>
                <th className="text-center px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item.sku} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-[12px] text-neutral-500">{item.sku}</td>
                  <td className="px-5 py-3 text-[12px] text-neutral-700">{item.name.replace(/Bold (Smart Lock - |Smart Lock |Elite |Smart Door |Connect WiFi |)/, '')}</td>
                  <td className="px-5 py-3 text-right text-neutral-900">{item.currentStock}</td>
                  <td className="px-5 py-3 text-right text-neutral-500">{item.soldLastMonth}</td>
                  <td className="px-5 py-3 text-right text-neutral-500">{item.avgMonthlySales}</td>
                  <td className="px-5 py-3 text-right text-neutral-500">
                    {item.weeksOfStockLeft !== null ? `${item.weeksOfStockLeft}w` : '-'}
                  </td>
                  <td className="px-5 py-3 text-right text-neutral-500">{item.expectedSalesNextMonth}</td>
                  <td className="px-5 py-3 text-right font-semibold text-neutral-900">
                    {item.proposedRestockQty > 0 ? item.proposedRestockQty : '-'}
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
          <h2 className="text-[14px] font-semibold text-neutral-900">Sales Velocity</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">Units sold per month for top SKUs</p>
        </div>
        <div className="p-5">
          <SalesVelocityChart data={monthlySales} skus={topSkus} />
        </div>
      </div>
    </div>
  );
}
