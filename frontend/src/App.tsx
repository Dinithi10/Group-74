import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoomCreationPage } from './pages/RoomCreationPage';
import { EditorPage } from './pages/EditorPage';
import { ViewerPage } from './pages/ViewerPage';
import { SavedDesignsPage } from './pages/SavedDesignsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminDesignsPage } from './pages/AdminDesignsPage';
import { AdminPricingPage } from './pages/AdminPricingPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-room" element={<RoomCreationPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/viewer" element={<ViewerPage />} />
            <Route path="/saved" element={<SavedDesignsPage />} />
            <Route path="/settings" element={<SettingsPlaceholder />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/designs" element={<AdminDesignsPage />} />
            <Route path="/admin/pricing" element={<AdminPricingPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontSize: '13px'
          }
        }} />

    </AppProvider>);

}
function SettingsPlaceholder() {
  return (
    <div className="p-8 flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚙️</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Coming soon</p>
      </div>
    </div>);

}