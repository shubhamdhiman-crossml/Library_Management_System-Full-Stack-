'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto app-content-bg">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
