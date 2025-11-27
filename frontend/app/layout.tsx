import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, BarChart3, Settings, PieChart } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Simple Mixpanel Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-indigo-600">Analytics</h1>
            </div>
            <nav className="mt-6 px-4 space-y-2">
              <Link href="/" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link href="/events" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <BarChart3 className="w-5 h-5 mr-3" />
                Events
              </Link>
              <Link href="/funnels" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <PieChart className="w-5 h-5 mr-3" />
                Funnels
              </Link>
              <Link href="/settings" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  U
                </div>
              </div>
            </header>
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
