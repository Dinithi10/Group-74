import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArmchairIcon, MailIcon, LockIcon, ArrowRightIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };
  const handleDemoLogin = async () => {
    setIsLoading(true);
    const success = await login('john@furniture.com', 'password');
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-20 left-[15%] w-20 h-14 rounded-lg bg-white/5 border border-white/10" />

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className="absolute top-40 right-[20%] w-16 h-16 rounded-lg bg-white/5 border border-white/10" />

        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 8, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
          className="absolute bottom-32 left-[25%] w-24 h-10 rounded-lg bg-white/5 border border-white/10" />

        <motion.div
          animate={{
            y: [0, 12, 0],
            rotate: [0, -6, 0]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
          className="absolute bottom-48 right-[15%] w-12 h-20 rounded-lg bg-white/5 border border-white/10" />

        <motion.div
          animate={{
            y: [0, -8, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3
          }}
          className="absolute top-[60%] left-[10%] w-14 h-14 rounded-full bg-white/[0.03] border border-white/10" />

      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="w-full max-w-md relative">

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/30">
              <ArmchairIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              FurnishViz
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Furniture visualization made simple
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                Email
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                  required />

              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                  required />

              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 disabled:opacity-60 transition-all shadow-lg shadow-indigo-500/25">

              {isLoading ?
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :

              <>
                  Sign In
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              }
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700" />
            </div>
            {/* <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500">
                or
              </span>
            </div> */}
          </div>

          {/* <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60 transition-all">

            Demo Login
          </button> */}
        </div>
      </motion.div>
    </div>);

}