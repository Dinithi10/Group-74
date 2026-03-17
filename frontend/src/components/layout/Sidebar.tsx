import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboardIcon,
  PlusSquareIcon,
  PenToolIcon,
  BoxIcon,
  SaveIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  LogOutIcon,
  ArmchairIcon,
  ChevronDownIcon,
  ShieldIcon,
  UsersIcon,
  FolderIcon,
  ShoppingCartIcon,
  DollarSignIcon } from
'lucide-react';
import { useApp } from '../../context/AppContext';
const navItems = [
  {
    to: '/dashboard',
    icon: LayoutDashboardIcon,
    label: 'Dashboard',
    roles: ['Admin', 'Designer']
  },
  {
    to: '/create-room',
    icon: PlusSquareIcon,
    label: 'Create Room',
    roles: ['Admin', 'Designer']
  },
  {
    to: '/editor',
    icon: PenToolIcon,
    label: '2D Editor',
    roles: ['Admin', 'Designer', 'Viewer']
  },
  {
    to: '/viewer',
    icon: BoxIcon,
    label: '3D Viewer',
    roles: ['Admin', 'Designer', 'Viewer']
  },
  {
    to: '/saved',
    icon: SaveIcon,
    label: 'Saved Designs',
    roles: ['Admin', 'Designer', 'Viewer']
  }
];

const adminItems = [
  {
    to: '/admin/users',
    icon: UsersIcon,
    label: 'User Management',
    roles: ['Admin']
  },
  {
    to: '/admin/designs',
    icon: FolderIcon,
    label: 'All Designs',
    roles: ['Admin']
  },
  {
    to: '/admin/pricing',
    icon: DollarSignIcon,
    label: 'Furniture Pricing',
    roles: ['Admin']
  }
];

export function Sidebar() {
  const {
    theme,
    toggleTheme,
    sidebarCollapsed,
    toggleSidebar,
    user,
    logout,
    cart
  } = useApp();
  const navigate = useNavigate();
  const [adminExpanded, setAdminExpanded] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <motion.aside
      animate={{
        width: sidebarCollapsed ? 72 : 240
      }}
      transition={{
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0">
          <ArmchairIcon className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed &&
          <motion.span
            initial={{
              opacity: 0,
              width: 0
            }}
            animate={{
              opacity: 1,
              width: 'auto'
            }}
            exit={{
              opacity: 0,
              width: 0
            }}
            transition={{
              duration: 0.2
            }}
            className="text-white font-bold text-lg whitespace-nowrap overflow-hidden">

              FurnishViz
            </motion.span>
          }
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.filter(item => {
          if (!user?.role) return false;
          return item.roles.includes(user.role);
        }).map((item) =>
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`
          }
          title={sidebarCollapsed ? item.label : undefined}>

            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed &&
            <motion.span
              initial={{
                opacity: 0,
                width: 0
              }}
              animate={{
                opacity: 1,
                width: 'auto'
              }}
              exit={{
                opacity: 0,
                width: 0
              }}
              transition={{
                duration: 0.2
              }}
              className="whitespace-nowrap overflow-hidden">

                  {item.label}
                </motion.span>
            }
            </AnimatePresence>
          </NavLink>
        )}

        {/* View Cart - New Item */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`
          }
          title={sidebarCollapsed ? 'View Cart' : undefined}>

          <div className="relative">
            <ShoppingCartIcon className="w-5 h-5 flex-shrink-0" />
            {cart.length > 0 &&
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            }
          </div>
          <AnimatePresence>
            {!sidebarCollapsed &&
            <motion.span
              initial={{
                opacity: 0,
                width: 0
              }}
              animate={{
                opacity: 1,
                width: 'auto'
              }}
              exit={{
                opacity: 0,
                width: 0
              }}
              transition={{
                duration: 0.2
              }}
              className="whitespace-nowrap overflow-hidden">

                View Cart
              </motion.span>
            }
          </AnimatePresence>
        </NavLink>

        {/* Admin Dashboard Collapsible Section */}
        {user?.role === 'Admin' && (
          <div className="pt-2">
            <button
              onClick={() => setAdminExpanded(!adminExpanded)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={sidebarCollapsed ? 'Admin Dashboard' : undefined}>

              <ShieldIcon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!sidebarCollapsed &&
                <>
                    <motion.span
                    initial={{
                      opacity: 0,
                      width: 0
                    }}
                    animate={{
                      opacity: 1,
                      width: 'auto'
                    }}
                    exit={{
                      opacity: 0,
                      width: 0
                    }}
                    transition={{
                      duration: 0.2
                    }}
                    className="whitespace-nowrap overflow-hidden flex-1 text-left">

                      Admin Dashboard
                    </motion.span>
                    <motion.div
                    animate={{
                      rotate: adminExpanded ? 180 : 0
                    }}
                    transition={{
                      duration: 0.2
                    }}>

                      <ChevronDownIcon className="w-4 h-4" />
                    </motion.div>
                  </>
                }
              </AnimatePresence>
            </button>

          {/* Admin Sub-items */}
          <AnimatePresence>
            {adminExpanded && !sidebarCollapsed &&
            <motion.div
              initial={{
                opacity: 0,
                height: 0
              }}
              animate={{
                opacity: 1,
                height: 'auto'
              }}
              exit={{
                opacity: 0,
                height: 0
              }}
              transition={{
                duration: 0.2
              }}
              className="overflow-hidden">

                <div className="pl-3 pt-1 space-y-1">
                  {adminItems.filter(item => item.roles.includes(user?.role || '')).map((item) =>
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`
                  }>

                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                    </NavLink>
                )}
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-2 border-t border-slate-800 pt-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full"
          title={
          sidebarCollapsed ?
          theme === 'light' ?
          'Dark mode' :
          'Light mode' :
          undefined
          }>

          {theme === 'light' ?
          <MoonIcon className="w-5 h-5 flex-shrink-0" /> :

          <SunIcon className="w-5 h-5 flex-shrink-0" />
          }
          <AnimatePresence>
            {!sidebarCollapsed &&
            <motion.span
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              className="whitespace-nowrap">

                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </motion.span>
            }
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full">

          {sidebarCollapsed ?
          <ChevronsRightIcon className="w-5 h-5 flex-shrink-0" /> :

          <ChevronsLeftIcon className="w-5 h-5 flex-shrink-0" />
          }
          <AnimatePresence>
            {!sidebarCollapsed &&
            <motion.span
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              className="whitespace-nowrap">

                Collapse
              </motion.span>
            }
          </AnimatePresence>
        </button>

        {/* User info */}
        {user &&
        <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user.name.charAt(0)}
              </span>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed &&
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              className="flex-1 min-w-0">

                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors">

                    <LogOutIcon className="w-3 h-3" />
                    Sign out
                  </button>
                </motion.div>
            }
            </AnimatePresence>
          </div>
        }
      </div>
    </motion.aside>);

}