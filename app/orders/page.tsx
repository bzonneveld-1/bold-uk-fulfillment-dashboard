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

  const monthlySales = getMonthlySalesData(orders);
  const monthlyOrders: { month: string; orders: number }[] = [];
  const ordersByMonth: Record<string, number> = {};
  for (const o of orders) {
    const m = o.created_on.slice(0, 7);
    ordersByMonth[m] = (ordersByMonth[m] || 0) + 1;
  }
  for (const [month, count] of Object.entries(ordersByMonth).sort()) {
    monthlyOrders.push({ month, orders: count });
  }

  // Show newest first
  const sorted = [...orders].sort(
    (a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Orders & Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">UK order fulfillment via NetXL</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Orders" value={orders.length} />
        <KpiCard title="This Month" value={ordersThisMonth.length} />
        <KpiCard title="With Tracking" value={withTracking.length} color="green" />
        <KpiCard
          title="Awaiting Shipment"
          value={awaitingShipment.length}
          color={awaitingShipment.length > 0 ? 'orange' : 'default'}
        />
      </div>

      <div className="bg-white rounded-xl border shadow-sm mb-8">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Order History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Order Ref</th>
                <th className="text-left p-3 font-medium">Customer Ref</th>
                <th className="text-left p-3 font-medium">SKU(s)</th>
                <th className="text-right p-3 font-medium">Qty</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Tracking</th>
                <th className="text-left p-3 font-medium">Ship Method</th>
                <th className="text-left p-3 font-medium">Recipient</th>
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
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-xs">
                      {new Date(order.created_on).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-3 font-mono text-xs">{order.order_reference}</td>
                    <td className="p-3 text-xs">{order.customer_reference}</td>
                    <td className="p-3 font-mono text-xs">{skus}</td>
                    <td className="p-3 text-right">{qty}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          hasTracking ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {hasTracking ? 'Shipped' : 'Processing'}
                      </span>
                    </td>
                    <td className="p-3 text-xs font-mono">
                      {tracking || '-'}
                    </td>
                    <td className="p-3 text-xs">
                      {methodId ? SHIPPING_METHODS[methodId] || `Method ${methodId}` : '-'}
                    </td>
                    <td className="p-3 text-xs truncate max-w-[150px]">{email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Monthly Order Volume</h2>
        </div>
        <div className="p-5">
          <OrderVolumeChart data={monthlyOrders} />
        </div>
      </div>
    </div>
  );
}
