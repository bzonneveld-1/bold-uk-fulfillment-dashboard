import { NextRequest } from 'next/server';
import { getOrders } from '@/lib/netxl-api';
import { ordersToCsv, generateFinanceSummary } from '@/lib/csv';
import { HANDLING_FEE_PER_ORDER } from '@/lib/pricing';

export async function GET(request: NextRequest) {
  // Verify API secret
  const secret = request.headers.get('x-api-secret');
  if (!secret || secret !== process.env.REPORTS_API_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Optional: ?month=2026-01 (defaults to previous month)
  const monthParam = request.nextUrl.searchParams.get('month');
  const now = new Date();
  let targetYear: number;
  let targetMonth: number;

  if (monthParam) {
    const [y, m] = monthParam.split('-').map(Number);
    targetYear = y;
    targetMonth = m;
  } else {
    // Previous month
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    targetYear = prev.getFullYear();
    targetMonth = prev.getMonth() + 1;
  }

  const monthStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;
  const monthName = new Date(targetYear, targetMonth - 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' });

  // Fetch all orders and filter to target month
  const allOrders = await getOrders();
  const monthOrders = allOrders.filter((o) => o.created_on.startsWith(monthStr));

  // Generate summary and CSV
  const summary = generateFinanceSummary(monthOrders);
  const csv = ordersToCsv(monthOrders);

  return Response.json({
    period: monthName,
    monthCode: monthStr,
    generatedAt: now.toISOString(),
    handlingFeePerOrder: HANDLING_FEE_PER_ORDER,
    summary: {
      totalOrders: summary.totalOrders,
      totalUnits: summary.totalUnits,
      totalCredited: summary.totalCredited,
      totalHandlingFees: summary.totalHandlingFees,
      netAmount: summary.netAmount,
    },
    skuBreakdown: summary.skuBreakdown,
    csv,
  });
}
