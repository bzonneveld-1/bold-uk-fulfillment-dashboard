import { getCredit, getCustomer, getAddresses } from '@/lib/netxl-api';
import KpiCard from '@/components/kpi-card';

export const revalidate = 3600; // 1 hour

export default async function AccountPage() {
  const [credit, customer, addresses] = await Promise.all([
    getCredit(),
    getCustomer(),
    getAddresses(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Credit & Account</h1>
        <p className="text-[13px] text-neutral-400 mt-1">
          {customer.first_name} {customer.last_name} &middot; {customer.email_address}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard title="Credit Limit" value={`£${credit.credit_limit.toFixed(2)}`} />
        <KpiCard title="Outstanding" value={`£${credit.total_outstanding.toFixed(2)}`} />
        <KpiCard title="Available Credit" value={`£${credit.available_credit.toFixed(2)}`} color="green" />
        <KpiCard title="Payment Terms" value={`${customer.credit_terms.term_days} days`} />
      </div>

      {credit.outstanding_orders.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200/80 mb-6">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="text-[14px] font-semibold text-neutral-900">Outstanding Orders</h2>
          </div>
          <div className="p-5">
            <pre className="text-[12px] text-neutral-500 font-mono">{JSON.stringify(credit.outstanding_orders, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-200/80">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-[14px] font-semibold text-neutral-900">Delivery Addresses ({addresses.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Company</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Address</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">City</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Postcode</th>
                <th className="text-left px-5 py-3 font-medium text-neutral-400 text-[11px] uppercase tracking-wider">Phone</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((addr) => (
                <tr key={addr.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-3 text-neutral-700">{addr.contact_name}</td>
                  <td className="px-5 py-3 text-[12px] text-neutral-500">{addr.company_name || '-'}</td>
                  <td className="px-5 py-3 text-[12px] text-neutral-500">
                    {addr.street_one}
                    {addr.street_two && `, ${addr.street_two}`}
                  </td>
                  <td className="px-5 py-3 text-neutral-700">{addr.city}</td>
                  <td className="px-5 py-3 font-mono text-[12px] text-neutral-500">{addr.zip}</td>
                  <td className="px-5 py-3 text-[12px] text-neutral-500">{addr.contact_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
