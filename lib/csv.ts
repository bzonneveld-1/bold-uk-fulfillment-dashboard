import { NetXLOrder } from './netxl-api';
import { SHIPPING_METHODS } from './config';
import { SKU_PRICING, getNetxlCostPrice, HANDLING_FEE_PER_ORDER } from './pricing';

interface OrderCsvRow {
  date: string;
  orderRef: string;
  customerRef: string;
  sku: string;
  exactCode: string;
  product: string;
  qty: number;
  retailInclBtw: number;
  costPriceExclBtw: number;
  lineTotal: number;
  tracking: string;
  shipMethod: string;
  recipient: string;
}

/** Generate CSV rows from orders with pricing */
export function ordersToRows(orders: NetXLOrder[]): OrderCsvRow[] {
  const rows: OrderCsvRow[] = [];
  for (const order of orders) {
    for (const item of order.items) {
      const sku = item.product.sku;
      const pricing = SKU_PRICING[sku];
      const costPrice = pricing ? getNetxlCostPrice(pricing.retailPriceInclBtw) : 0;
      const tracking = order.shipping[0]?.tracking_number || '';
      const methodId = order.shipping[0]?.method_id;
      const email = order.shipping[0]?.contact_email || '';

      rows.push({
        date: new Date(order.created_on).toLocaleDateString('en-GB'),
        orderRef: order.order_reference,
        customerRef: order.customer_reference,
        sku,
        exactCode: pricing?.exactCode || '',
        product: pricing?.exactName || sku,
        qty: item.quantity,
        retailInclBtw: pricing?.retailPriceInclBtw || 0,
        costPriceExclBtw: costPrice,
        lineTotal: Math.round(costPrice * item.quantity * 100) / 100,
        tracking,
        shipMethod: methodId ? SHIPPING_METHODS[methodId] || `Method ${methodId}` : '',
        recipient: email,
      });
    }
  }
  return rows;
}

/** Generate CSV string from orders (for export button) */
export function ordersToCsv(orders: NetXLOrder[]): string {
  const headers = [
    'Date', 'Order Ref', 'Customer Ref', 'SKU', 'Exact Code', 'Product',
    'Qty', 'Retail (incl BTW)', 'Cost Price (excl BTW)', 'Line Total',
    'Tracking', 'Ship Method', 'Recipient',
  ];

  const rows = ordersToRows(orders);
  const lines = rows.map((r) =>
    [
      r.date, r.orderRef, r.customerRef, r.sku, r.exactCode, `"${r.product}"`,
      r.qty, r.retailInclBtw.toFixed(2), r.costPriceExclBtw.toFixed(2), r.lineTotal.toFixed(2),
      r.tracking, r.shipMethod, r.recipient,
    ].join(';')
  );

  return [headers.join(';'), ...lines].join('\n');
}

/** Generate finance summary for a set of orders */
export function generateFinanceSummary(orders: NetXLOrder[]) {
  const rows = ordersToRows(orders);
  const totalCredited = rows.reduce((sum, r) => sum + r.lineTotal, 0);
  const uniqueOrders = new Set(orders.map((o) => o.id)).size;
  const totalHandlingFees = uniqueOrders * HANDLING_FEE_PER_ORDER;
  const totalUnits = rows.reduce((sum, r) => sum + r.qty, 0);

  // Per-SKU breakdown
  const skuBreakdown: Record<string, { qty: number; total: number; exactCode: string; product: string }> = {};
  for (const row of rows) {
    if (!skuBreakdown[row.sku]) {
      skuBreakdown[row.sku] = { qty: 0, total: 0, exactCode: row.exactCode, product: row.product };
    }
    skuBreakdown[row.sku].qty += row.qty;
    skuBreakdown[row.sku].total += row.lineTotal;
  }

  return {
    totalOrders: uniqueOrders,
    totalUnits,
    totalCredited: Math.round(totalCredited * 100) / 100,
    totalHandlingFees: Math.round(totalHandlingFees * 100) / 100,
    netAmount: Math.round((totalCredited - totalHandlingFees) * 100) / 100,
    skuBreakdown,
  };
}
