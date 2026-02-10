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
        <h1 className="text-2xl font-bold">Credit & Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Trade account: {customer.first_name} {customer.last_name} &middot; {customer.email_address}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Credit Limit" value={`£${credit.credit_limit.toFixed(2)}`} />
        <KpiCard title="Outstanding" value={`£${credit.total_outstanding.toFixed(2)}`} />
        <KpiCard title="Available Credit" value={`£${credit.available_credit.toFixed(2)}`} color="green" />
        <KpiCard title="Payment Terms" value={`${customer.credit_terms.term_days} days`} />
      </div>

      {credit.outstanding_orders.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm mb-8">
          <div className="p-5 border-b">
            <h2 className="font-semibold">Outstanding Orders</h2>
          </div>
          <div className="p-5">
            <pre className="text-sm text-gray-600">{JSON.stringify(credit.outstanding_orders, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Delivery Addresses ({addresses.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">Contact</th>
                <th className="text-left p-3 font-medium">Company</th>
                <th className="text-left p-3 font-medium">Address</th>
                <th className="text-left p-3 font-medium">City</th>
                <th className="text-left p-3 font-medium">Postcode</th>
                <th className="text-left p-3 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((addr) => (
                <tr key={addr.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-xs text-gray-400">{addr.id}</td>
                  <td className="p-3">{addr.contact_name}</td>
                  <td className="p-3 text-xs">{addr.company_name || '-'}</td>
                  <td className="p-3 text-xs">
                    {addr.street_one}
                    {addr.street_two && `, ${addr.street_two}`}
                  </td>
                  <td className="p-3">{addr.city}</td>
                  <td className="p-3 font-mono text-xs">{addr.zip}</td>
                  <td className="p-3 text-xs">{addr.contact_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
