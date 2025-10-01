import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Gauge, Users, Package, CalendarClock, Activity, Boxes, Truck, Settings } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { to: '/app/dashboard', label: 'Dashboard', icon: <Gauge size={18} /> },
  { to: '/app/catalog', label: 'Catalogo', icon: <Users size={18} /> },
  { to: '/app/orders', label: 'Ordini clienti', icon: <Package size={18} /> },
  { to: '/app/production/schedules', label: 'Programmazione', icon: <CalendarClock size={18} /> },
  { to: '/app/production/progress', label: 'Avanzamento', icon: <Activity size={18} /> },
  { to: '/app/inventory', label: 'Giacenze', icon: <Boxes size={18} /> },
  { to: '/app/deliveries', label: 'Consegne', icon: <Truck size={18} /> },
];

interface SidebarProps {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}

export function Sidebar({ variant = 'desktop', onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex min-h-full w-64 flex-col border-r border-gray-200 bg-gray-50/80 p-6 shadow-[inset_-8px_0_30px_rgba(37,99,235,0.1)] backdrop-blur',
        variant === 'desktop' ? 'hidden lg:flex' : 'lg:hidden'
      )}
    >
      <div className="mb-10">
        <div className="text-sm uppercase tracking-[0.4em] text-gray-500">Optima</div>
        <h1 className="mt-2 font-display text-2xl text-primary">Production Suite</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/20 text-primary shadow-neon'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <span className="text-primary/70 transition-colors group-hover:text-primary">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Settings size={14} />
          <span>Build {__APP_VERSION__}</span>
        </div>
      </div>
    </aside>
  );
}
