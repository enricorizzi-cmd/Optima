import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Gauge, Users, Package, CalendarClock, Activity, Boxes, Truck, Settings } from 'lucide-react';
const navItems = [
    { to: '/app/dashboard', label: 'Dashboard', icon: _jsx(Gauge, { size: 18 }) },
    { to: '/app/catalog', label: 'Catalogo', icon: _jsx(Users, { size: 18 }) },
    { to: '/app/orders', label: 'Ordini clienti', icon: _jsx(Package, { size: 18 }) },
    { to: '/app/production/schedules', label: 'Programmazione', icon: _jsx(CalendarClock, { size: 18 }) },
    { to: '/app/production/progress', label: 'Avanzamento', icon: _jsx(Activity, { size: 18 }) },
    { to: '/app/inventory', label: 'Giacenze', icon: _jsx(Boxes, { size: 18 }) },
    { to: '/app/deliveries', label: 'Consegne', icon: _jsx(Truck, { size: 18 }) },
];
export function Sidebar({ variant = 'desktop', onNavigate }) {
    return (_jsxs("aside", { className: cn('flex min-h-full w-64 flex-col border-r border-gray-200 bg-gray-50/80 p-6 shadow-[inset_-8px_0_30px_rgba(37,99,235,0.1)] backdrop-blur', variant === 'desktop' ? 'hidden lg:flex' : 'lg:hidden'), children: [_jsxs("div", { className: "mb-10", children: [_jsx("div", { className: "text-sm uppercase tracking-[0.4em] text-gray-500", children: "Optima" }), _jsx("h1", { className: "mt-2 font-display text-2xl text-primary", children: "Production Suite" })] }), _jsx("nav", { className: "flex flex-1 flex-col gap-2", children: navItems.map((item) => (_jsxs(NavLink, { to: item.to, onClick: onNavigate, className: ({ isActive }) => cn('group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors', isActive
                        ? 'bg-primary/20 text-primary shadow-neon'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'), children: [_jsx("span", { className: "text-primary/70 transition-colors group-hover:text-primary", children: item.icon }), _jsx("span", { children: item.label })] }, item.to))) }), _jsx("div", { className: "mt-auto pt-6 text-xs text-gray-500", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Settings, { size: 14 }), _jsxs("span", { children: ["Build ", __APP_VERSION__] })] }) })] }));
}
