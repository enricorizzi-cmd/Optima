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
import { Toaster } from './components/ui/toaster';

function RequireAuth() {
  const { session, isLoading } = useSessionContext();

  if (isLoading) {
    return <LoadingScreen message="Verifica credenziali..." />;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

export default function App() {
  const { session } = useSessionContext();

  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="production">
              <Route index element={<Navigate to="schedules" replace />} />
              <Route path="schedules" element={<ProductionSchedulesPage />} />
              <Route path="progress" element={<ProductionProgressPage />} />
            </Route>
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={<Navigate to={session ? '/app/dashboard' : '/auth'} replace />}
        />
      </Routes>
      <Toaster />
    </>
  );
}
