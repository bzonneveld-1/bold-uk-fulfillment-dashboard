import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bold UK Fulfillment Dashboard',
  description: 'Operational dashboard for Bold Smartlock UK fulfillment via NetXL',
};

const NAV_ITEMS = [
  { href: '/', label: 'Stock Overview', icon: '📦' },
  { href: '/restock', label: 'Restock Report', icon: '📋' },
  { href: '/orders', label: 'Orders & Tracking', icon: '🚚' },
  { href: '/account', label: 'Credit & Account', icon: '💳' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
            <div className="p-6 border-b border-gray-700">
              <h1 className="text-lg font-bold">Bold UK Fulfillment</h1>
              <p className="text-xs text-gray-400 mt-1">NetXL Warehouse Dashboard</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
              Data refreshes every 15 min
            </div>
          </aside>
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
