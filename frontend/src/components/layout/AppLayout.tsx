import { Link, Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, SearchIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';
export function AppLayout() {
  const { user, sidebarCollapsed, cart, initializing } = useApp();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-pulse flex items-center justify-center">
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-48 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-full h-full bg-indigo-600 origin-left animate-loading-bar" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500 dark:text-slate-400 animate-pulse">
              Restoring session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Frontend Route Protection
  const location = window.location.pathname;
  if (user.role === 'Viewer' && ['/create-room', '/admin/users', '/admin/designs', '/admin/pricing'].some(path => location.startsWith(path))) {
    return <Navigate to="/dashboard" replace />;
  }
  if (user.role === 'Designer' && location.startsWith('/admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Sidebar />

      <motion.div
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 240
        }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="min-h-screen flex flex-col">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search designs..."
                className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />

            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/cart"
              className="relative p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-indigo-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                  {cart.length}
                </span>
              )}
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {user?.name.charAt(0)}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </motion.div>
    </div>);

}