import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  UserIcon,
  MailIcon,
  ShieldIcon,
  CheckCircleIcon } from
'lucide-react';
interface UserFormData {
  name: string;
  email: string;
  role: 'Admin' | 'Designer' | 'Viewer';
  status: 'Active' | 'Inactive';
  password?: string;
}
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
  mode: 'add' | 'edit';
}
export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      name: '',
      email: '',
      role: 'Designer',
      status: 'Active',
      password: ''
    }
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>>(
    {});
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (mode === 'add' && !formData.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'Designer',
        status: 'Active',
        password: ''
      });
      setErrors({});
    }
  };
  const handleClose = () => {
    onClose();
    setErrors({});
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
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
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />


          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl pointer-events-auto">

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {mode === 'add' ? 'Add New User' : 'Edit User'}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {mode === 'add' ?
                    'Create a new user account' :
                    'Update user information'}
                    </p>
                  </div>
                </div>
                <button
                onClick={handleClose}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">

                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                    }
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />

                  </div>
                  {errors.name &&
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                }
                </div>

                {/* Email */}
                <div>
                  <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                    Email Address
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value
                    })
                    }
                    placeholder="john@company.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />

                  </div>
                  {errors.email &&
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                }
                </div>

                {/* Password */}
                <div>
                  <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    {mode === 'add' ? 'Password' : 'Change Password (optional)'}
                  </label>
                  <div className="relative">
                    <ShieldIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value
                    })
                    }
                    placeholder={mode === 'add' ? '••••••••' : 'Leave blank to keep current'}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />
                  </div>
                  {errors.password &&
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                }
                </div>

                {/* Role */}
                <div>
                  <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                    Role
                  </label>
                  <div className="relative">
                    <ShieldIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserFormData['role']
                    })
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all appearance-none">

                      <option value="Admin">Admin</option>
                      <option value="Designer">Designer</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                    Status
                  </label>
                  <div className="relative">
                    <CheckCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as UserFormData['status']
                    })
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all appearance-none">

                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">

                    Cancel
                  </button>
                  <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25">

                    {mode === 'add' ? 'Add User' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}