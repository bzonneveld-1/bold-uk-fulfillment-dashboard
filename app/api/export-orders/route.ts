import { getOrders } from '@/lib/netxl-api';
import { ordersToCsv } from '@/lib/csv';

export async function GET() {
  const orders = await getOrders();
  const csv = ordersToCsv(orders);
  const filename = `bold-uk-orders-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
