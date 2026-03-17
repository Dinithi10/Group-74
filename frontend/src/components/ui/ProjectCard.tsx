import React from 'react';
import { motion } from 'framer-motion';
import { PenToolIcon, BoxIcon, TrashIcon, DollarSignIcon, CalendarIcon } from 'lucide-react';
import { gradientThumbnails } from '../../data/mockData';
interface ProjectCardProps {
  id: string;
  name: string;
  roomName?: string;
  date: string;
  furnitureCount?: number;
  dimensions?: string;
  index?: number;
  onEdit?: () => void;
  onView3D?: () => void;
  onDelete?: () => void;
  price?: number;
  onViewPrice?: () => void;
}
export function ProjectCard({
  name,
  roomName,
  date,
  furnitureCount,
  dimensions,
  index = 0,
  onEdit,
  onView3D,
  onDelete,
  price,
  onViewPrice
}: ProjectCardProps) {
  const gradient = gradientThumbnails[index % gradientThumbnails.length];
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
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-card overflow-hidden">

      {/* Thumbnail */}
      <div
        className="h-36 w-full relative"
        style={{
          background: gradient
        }}>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30" />
          <div className="w-8 h-8 rounded-md bg-white/15 backdrop-blur-sm border border-white/20 absolute top-6 right-8" />
          <div className="w-10 h-6 rounded-md bg-white/15 backdrop-blur-sm border border-white/20 absolute bottom-8 left-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base">
          {name}
        </h3>
        <div className="mt-2 space-y-1.5">
          {roomName &&
          <p className="text-xs text-gray-500 dark:text-slate-400">
              {roomName}
            </p>
          }
          {dimensions &&
          <p className="text-xs text-gray-400 dark:text-slate-500">
              {dimensions}
            </p>
          }
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {date}
            </span>
            {furnitureCount !== undefined &&
            <span>{furnitureCount} items</span>
            }
          </div>
        </div>

        {/* Price Display */}
        {price !== undefined &&
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
            <span className="text-xs text-gray-500 dark:text-slate-400">
              Estimated Price
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              ${price.toFixed(2)}+
            </span>
          </div>
        }

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          {onViewPrice &&
          <button
            onClick={onViewPrice}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">

              <DollarSignIcon className="w-3 h-3" />
              View Price
            </button>
          }
          {onEdit &&
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">

              <PenToolIcon className="w-3 h-3" />
              Edit
            </button>
          }
          {onView3D &&
          <button
            onClick={onView3D}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/40 transition-colors">

              <BoxIcon className="w-3 h-3" />
              3D View
            </button>
          }
          {onDelete &&
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors ml-auto">

              <TrashIcon className="w-3 h-3" />
            </button>
          }
        </div>
      </div>
    </motion.div>);

}