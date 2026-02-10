import { NetXLProduct, NetXLOrder } from './netxl-api';
import { STOCK_CONFIG } from './config';

export interface SkuSalesData {
  sku: string;
  name: string;
  currentStock: number;
  soldLastMonth: number;
  avgMonthlySales: number;
  weeksOfStockLeft: number | null;
  expectedSalesNextMonth: number;
  proposedRestockQty: number;
  urgency: 'urgent' | 'soon' | 'ok' | 'out_of_stock';
}

export interface MonthlySales {
  month: string;
  [sku: string]: number | string;
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function calculateSalesVelocity(
  products: NetXLProduct[],
  orders: NetXLOrder[]
): SkuSalesData[] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate total sold per SKU and sold last 30 days
  const totalSold: Record<string, number> = {};
  const soldLast30: Record<string, number> = {};
  let earliestOrder: Date | null = null;

  for (const order of orders) {
    const orderDate = new Date(order.created_on);
    if (!earliestOrder || orderDate < earliestOrder) earliestOrder = orderDate;

    for (const item of order.items) {
      const sku = item.product.sku;
      totalSold[sku] = (totalSold[sku] || 0) + item.quantity;
      if (orderDate >= thirtyDaysAgo) {
        soldLast30[sku] = (soldLast30[sku] || 0) + item.quantity;
      }
    }
  }

  // Months of history
  const monthsOfHistory = earliestOrder
    ? Math.max(1, (now.getTime() - earliestOrder.getTime()) / (30.44 * 24 * 60 * 60 * 1000))
    : 1;

  return products.map((p) => {
    const stock = p.availability.available;
    const sold30 = soldLast30[p.sku] || 0;
    const total = totalSold[p.sku] || 0;
    const avgMonthly = total / monthsOfHistory;
    const weeklyAvg = avgMonthly / 4.33;
    const weeksLeft = weeklyAvg > 0 ? stock / weeklyAvg : null;
    const expectedNext = Math.round(avgMonthly * 10) / 10;
    const targetStock = Math.ceil(STOCK_CONFIG.TARGET_RESTOCK_WEEKS * weeklyAvg);
    const proposedRestock = Math.max(0, targetStock - stock);

    let urgency: SkuSalesData['urgency'] = 'ok';
    if (stock === 0) urgency = 'out_of_stock';
    else if (weeksLeft !== null && weeksLeft < STOCK_CONFIG.URGENT_STOCK_WEEKS) urgency = 'urgent';
    else if (weeksLeft !== null && weeksLeft < STOCK_CONFIG.LOW_STOCK_WEEKS) urgency = 'soon';
    else if (stock < STOCK_CONFIG.MIN_STOCK_THRESHOLD) urgency = 'soon';

    return {
      sku: p.sku,
      name: p.name,
      currentStock: stock,
      soldLastMonth: sold30,
      avgMonthlySales: Math.round(avgMonthly * 10) / 10,
      weeksOfStockLeft: weeksLeft !== null ? Math.round(weeksLeft * 10) / 10 : null,
      expectedSalesNextMonth: expectedNext,
      proposedRestockQty: proposedRestock,
      urgency,
    };
  });
}

export function getMonthlySalesData(orders: NetXLOrder[]): MonthlySales[] {
  const monthMap: Record<string, Record<string, number>> = {};

  for (const order of orders) {
    const month = getMonthKey(new Date(order.created_on));
    if (!monthMap[month]) monthMap[month] = {};
    for (const item of order.items) {
      monthMap[month][item.product.sku] = (monthMap[month][item.product.sku] || 0) + item.quantity;
    }
  }

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, skus]) => ({ month, ...skus }));
}

export function getOrdersThisMonth(orders: NetXLOrder[]): NetXLOrder[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return orders.filter((o) => new Date(o.created_on) >= startOfMonth);
}
