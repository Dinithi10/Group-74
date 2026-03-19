import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  SortDescIcon,
  UserPlusIcon,
  MailIcon,
  ShieldCheckIcon,
  TrashIcon,
  EditIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserFormModal } from '../components/ui/UserFormModal';
import type { AdminUser } from '../context/AppContext';
export function AdminUsersPage() {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser } =
  useApp();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'designs'>('date');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const filtered = adminUsers.
  filter(
    (u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ).
  sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'date') {
      const dateA = a.joinedDate ? new Date(a.joinedDate).getTime() : 0;
      const dateB = b.joinedDate ? new Date(b.joinedDate).getTime() : 0;
      return dateB - dateA;
    }
    return (b.designCount || 0) - (a.designCount || 0);
  });
  const handleAddUser = async (data: any) => {
    await addAdminUser(data);
    setIsAddModalOpen(false);
  };
  const handleEditUser = async (data: any) => {
    if (editingUser) {
      await updateAdminUser(editingUser.id, data);
      setEditingUser(null);
    }
  };
  const handleDeleteUser = async (id: string) => {
    await deleteAdminUser(id);
  };
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'Designer':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-400';
    }
  };
  const getStatusBadgeColor = (status: string) => {
    return status === 'Active' ?
    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
    'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-500';
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            {adminUsers.length} user{adminUsers.length !== 1 ? 's' : ''}{' '}
            registered
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-56 pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
            <SortDescIcon className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) =>
              setSortBy(e.target.value as 'name' | 'date' | 'designs')
              }
              className="text-sm bg-transparent text-gray-700 dark:text-slate-300 focus:outline-none">

              <option value="date">Newest first</option>
              <option value="name">Name A-Z</option>
              <option value="designs">Most designs</option>
            </select>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25">

            <UserPlusIcon className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Users Grid */}
      {filtered.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((user, i) =>
        <motion.div
          key={user.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.4,
            delay: i * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-card p-6">

              {/* User Avatar & Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 mt-1">
                    <MailIcon className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getRoleBadgeColor(user.role)}`}>

                  <ShieldCheckIcon className="w-3 h-3 mr-1" />
                  {user.role}
                </span>
                <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadgeColor(user.status)}`}>

                  {user.status}
                </span>
              </div>

              {/* Stats */}
              <div className="mb-4">
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl px-3 py-2 flex items-center justify-between">
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    Joined
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-xs">
                    {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
              onClick={() => setEditingUser(user)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">

                  <EditIcon className="w-3 h-3" />
                  Edit
                </button>
                <button
              onClick={() => handleDeleteUser(user.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">

                  <TrashIcon className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </motion.div>
        )}
        </div> :

      <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <UserPlusIcon className="w-8 h-8 text-gray-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            No users found
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm">
            {search ?
          'Try a different search term.' :
          'No users registered yet.'}
          </p>
        </div>
      }

      {/* Add User Modal */}
      <UserFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
        mode="add" />


      {/* Edit User Modal */}
      <UserFormModal
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        onSubmit={handleEditUser}
        initialData={
        editingUser ?
        {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          status: editingUser.status
        } :
        undefined
        }
        mode="edit" />

    </motion.div>);

}