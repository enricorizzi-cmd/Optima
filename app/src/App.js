import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { AppShell } from './components/layout/AppShell';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductionSchedulesPage } from './pages/ProductionSchedulesPage';
import { ProductionProgressPage } from './pages/ProductionProgressPage';
import { InventoryPage } from './pages/InventoryPage';
import { DeliveriesPage } from './pages/DeliveriesPage';
import { LoadingScreen } from './pages/LoadingScreen';
function RequireAuth() {
    const { session, isLoading } = useSessionContext();
    if (isLoading) {
        return _jsx(LoadingScreen, { message: "Verifica credenziali..." });
    }
    if (!session) {
        return _jsx(Navigate, { to: "/auth", replace: true });
    }
    return _jsx(Outlet, {});
}
export default function App() {
    const { session } = useSessionContext();
    return (_jsx(_Fragment, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/auth", element: _jsx(AuthPage, {}) }), _jsx(Route, { element: _jsx(RequireAuth, {}), children: _jsxs(Route, { path: "/app", element: _jsx(AppShell, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "catalog", element: _jsx(CatalogPage, {}) }), _jsx(Route, { path: "orders", element: _jsx(OrdersPage, {}) }), _jsxs(Route, { path: "production", children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "schedules", replace: true }) }), _jsx(Route, { path: "schedules", element: _jsx(ProductionSchedulesPage, {}) }), _jsx(Route, { path: "progress", element: _jsx(ProductionProgressPage, {}) })] }), _jsx(Route, { path: "inventory", element: _jsx(InventoryPage, {}) }), _jsx(Route, { path: "deliveries", element: _jsx(DeliveriesPage, {}) })] }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: session ? '/app/dashboard' : '/auth', replace: true }) })] }) }));
}
