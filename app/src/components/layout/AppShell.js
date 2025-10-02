import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '../ui/toaster';
import { cn } from '../../lib/utils';
export function AppShell() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsx(Toaster, { children: _jsxs("div", { className: "flex min-h-screen bg-white text-gray-900", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { onToggleSidebar: () => setSidebarOpen((value) => !value) }), _jsx("main", { className: cn('flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10'), children: _jsx("div", { className: "mx-auto flex w-full max-w-[1400px] flex-col gap-6", children: _jsx(Outlet, {}) }) })] }), _jsxs("div", { className: cn('fixed inset-y-0 right-0 z-30 w-64 bg-gray-50/95 p-6 shadow-xl transition-transform lg:hidden', sidebarOpen ? 'translate-x-0' : 'translate-x-full'), children: [_jsx("button", { className: "mb-4 text-sm text-gray-600 hover:text-gray-900", onClick: () => setSidebarOpen(false), children: "Chiudi" }), _jsx(Sidebar, { variant: "mobile", onNavigate: () => setSidebarOpen(false) })] }), sidebarOpen && (_jsx("div", { className: "fixed inset-0 z-20 bg-gray-900/60 backdrop-blur-sm lg:hidden", onClick: () => setSidebarOpen(false) }))] }) }));
}
