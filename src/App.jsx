import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/management/Users';
import Permissions from '@/pages/management/Permissions';
import RawMaterials from '@/pages/products/RawMaterials';
import FinishedProducts from '@/pages/products/FinishedProducts';
import ProductionOrders from '@/pages/production/ProductionOrders';
import StockPosition from '@/pages/inventory/StockPosition';
import MaterialEntries from '@/pages/inventory/MaterialEntries';
import StockMovements from '@/pages/inventory/StockMovements';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-800">Carregando...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
      
      <Route 
        path="/" 
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="management/users" element={<Users />} />
        <Route path="management/permissions" element={<Permissions />} />
        <Route path="products/raw-materials" element={<RawMaterials />} />
        <Route path="products/finished-products" element={<FinishedProducts />} />
        <Route path="production/orders" element={<ProductionOrders />} />
        <Route path="inventory/position" element={<StockPosition />} />
        <Route path="inventory/entries" element={<MaterialEntries />} />
        <Route path="inventory/movements" element={<StockMovements />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
