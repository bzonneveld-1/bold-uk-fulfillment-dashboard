import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bold UK Fulfillment',
  description: 'Operational dashboard for Bold Smartlock UK fulfillment via NetXL',
};

const NAV_ITEMS = [
  { href: '/', label: 'Stock Overview' },
  { href: '/restock', label: 'Restock Report' },
  { href: '/orders', label: 'Orders & Tracking' },
  { href: '/account', label: 'Credit & Account' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900">
        <div className="flex min-h-screen">
          <aside className="w-56 border-r border-neutral-200 flex flex-col shrink-0">
            <div className="px-6 py-6">
              <Link href="/" className="block">
                <span className="text-xl font-semibold tracking-tight">bold</span>
                <span className="block text-[11px] text-neutral-400 font-normal tracking-wide uppercase mt-0.5">UK Fulfillment</span>
              </Link>
            </div>
            <nav className="flex-1 px-3 space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-lg text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="px-6 py-4 text-[11px] text-neutral-300">
              Updates every 15 min
            </div>
          </aside>
          <main className="flex-1 bg-neutral-50/50 overflow-auto">
            <div className="max-w-6xl mx-auto px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
