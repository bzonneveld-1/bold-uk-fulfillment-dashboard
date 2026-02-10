import { getOrders } from '@/lib/netxl-api';
import { getOrdersThisMonth, getMonthlySalesData } from '@/lib/calculations';
import { SHIPPING_METHODS } from '@/lib/config';
import KpiCard from '@/components/kpi-card';
import OrderVolumeChart from '@/components/order-volume-chart';

export const revalidate = 300; // 5 minutes

export default async function OrdersPage() {
  const orders = await getOrders();
  const ordersThisMonth = getOrdersThisMonth(orders);
  const withTracking = orders.filter((o) => o.shipping.some((s) => s.tracking_number));
  const awaitingShipment = orders.filter((o) => !o.shipping.some((s) => s.tracking_number));

  const monthlyOrders: { month: string; orders: number }[] = [];
  const ordersByMonth: Record<string, number> = {};
  for (const o of orders) {
    const m = o.created_on.slice(0, 7);
    ordersByMonth[m] = (ordersByMonth[m] || 0) + 1;
  }
  for (const [month, count] of Object.entries(ordersByMonth).sort()) {
    monthlyOrders.push({ month, orders: count });
  }

  const sorted = [...orders].sort(
    (a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Orders & Tracking</h1>
          <p className="text-[13px] text-neutral-400 mt-1">UK order fulfillment via NetXL</p>
        </div>
        <a
          href="/api/export-orders"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-[12px] font-medium text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard title="Total Orders" value={orders.length} />
        <KpiCard title="This Month" value={ordersThisMonth.length} />
        <KpiCard title="Shipped" value={withTracking.length} color="green" />
        <KpiCard
          title="Awaiting Shipment"
          value={awaitingShipment.length}
          color={awaitingShipment.length > 0 ? 'orange' : 'default'}
        />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/80 mb-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-[14px] font-semibold text-neutral-900">Order History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Order Ref</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Customer Ref</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">SKU(s)</th>
                <th className="text-right px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Qty</th>
                <th className="text-center px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Tracking</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Ship Method</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Recipient</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((order) => {
                const skus = order.items.map((i) => i.product.sku).join(', ');
                const qty = order.items.reduce((s, i) => s + i.quantity, 0);
                const tracking = order.shipping[0]?.tracking_number;
                const methodId = order.shipping[0]?.method_id;
                const email = order.shipping[0]?.contact_email || '';
                const hasTracking = !!tracking;

                return (
                  <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3 text-[12px] text-neutral-500">
                      {new Date(order.created_on).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] text-neutral-700">{order.order_reference}</td>
                    <td className="px-5 py-3 text-[12px] text-neutral-500">{order.customer_reference}</td>
                    <td className="px-5 py-3 font-mono text-[12px] text-neutral-500">{skus}</td>
                    <td className="px-5 py-3 text-right text-neutral-900">{qty}</td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${
                          hasTracking
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {hasTracking ? 'Shipped' : 'Processing'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] font-mono text-neutral-500">
                      {tracking || '-'}
                    </td>
                    <td className="px-5 py-3 text-[12px] text-neutral-500">
                      {methodId ? SHIPPING_METHODS[methodId] || `Method ${methodId}` : '-'}
                    </td>
                    <td className="px-5 py-3 text-[12px] text-neutral-500 truncate max-w-[150px]">{email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/80">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-[14px] font-semibold text-neutral-900">Monthly Volume</h2>
        </div>
        <div className="p-5">
          <OrderVolumeChart data={monthlyOrders} />
        </div>
      </div>
    </div>
  );
}
