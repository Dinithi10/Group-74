import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
interface StatsCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  trend?: string;
  color: string;
  index?: number;
}
export function StatsCard({
  icon,
  value,
  label,
  trend,
  color,
  index = 0
}: StatsCardProps) {
  return (
    <motion.div
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
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6 shadow-card">

      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              backgroundColor: `${color}15`
            }}>

            <div
              style={{
                color
              }}>

              {icon}
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {value}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {label}
            </p>
          </div>
        </div>
        {trend &&
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            {trend}
          </span>
        }
      </div>
      {/* Decorative gradient blob */}
      <div
        className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.07]"
        style={{
          backgroundColor: color
        }} />

    </motion.div>);

}