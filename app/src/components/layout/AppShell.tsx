import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '../ui/toaster';
import { cn } from '../../lib/utils';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Toaster>
      <div className="flex min-h-screen bg-white text-gray-900">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((value) => !value)} />
          <main className={cn('flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10')}>
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
              <Outlet />
            </div>
          </main>
        </div>
        <div
          className={cn(
            'fixed inset-y-0 right-0 z-30 w-64 bg-gray-50/95 p-6 shadow-xl transition-transform lg:hidden',
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <button
            className="mb-4 text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            Chiudi
          </button>
          <Sidebar variant="mobile" onNavigate={() => setSidebarOpen(false)} />
        </div>
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-gray-900/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </Toaster>
  );
}
