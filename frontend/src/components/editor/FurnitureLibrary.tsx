import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, GripVerticalIcon } from 'lucide-react';
import {
  furnitureCatalog,
  type FurnitureCatalogItem } from
'../../data/mockData';
interface FurnitureLibraryProps {
  onAddFurniture: (item: FurnitureCatalogItem) => void;
}
export function FurnitureLibrary({ onAddFurniture }: FurnitureLibraryProps) {
  const [search, setSearch] = useState('');
  const filtered = furnitureCatalog.filter(
    (item) =>
    item.type.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );
  const categories = Array.from(new Set(filtered.map((i) => i.category)));
  return (
    <div className="w-60 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Furniture Library
        </h2>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((category) =>
        <div key={category}>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">
              {category}
            </p>
            <div className="space-y-1.5">
              {filtered.
            filter((item) => item.category === category).
            map((item, i) =>
            <motion.button
              key={item.type}
              initial={{
                opacity: 0,
                x: -10
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: i * 0.05
              }}
              onClick={() => onAddFurniture(item)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors group">

                    <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  backgroundColor: `${item.defaultColor}15`
                }}>

                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-slate-200">
                        {item.type}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">
                        {item.defaultWidth}×{item.defaultHeight}m
                      </p>
                    </div>
                    <GripVerticalIcon className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
            )}
            </div>
          </div>
        )}

        {filtered.length === 0 &&
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-8">
            No items found
          </p>
        }
      </div>
    </div>);

}