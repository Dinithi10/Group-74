import { motion, AnimatePresence } from 'framer-motion';
import { TrashIcon, CopyIcon, XIcon } from 'lucide-react';
import type { FurnitureItem } from '../../data/mockData';
interface PropertiesPanelProps {
  selectedItem: FurnitureItem | null;
  onUpdate: (id: string, updates: Partial<FurnitureItem>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: FurnitureItem) => void;
  onDeselect: () => void;
}
export function PropertiesPanel({
  selectedItem,
  onUpdate,
  onDelete,
  onDuplicate,
  onDeselect
}: PropertiesPanelProps) {
  return (
    <AnimatePresence>
      {selectedItem &&
      <motion.div
        initial={{
          x: 20,
          opacity: 0
        }}
        animate={{
          x: 0,
          opacity: 1
        }}
        exit={{
          x: 20,
          opacity: 0
        }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="w-72 bg-white dark:bg-slate-800 border-l border-gray-100 dark:border-slate-700 flex flex-col h-full overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Properties
              </h2>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                {selectedItem.type}
              </p>
            </div>
            <button
            onClick={onDeselect}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">

              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* Color */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                type="color"
                value={selectedItem.color}
                onChange={(e) =>
                onUpdate(selectedItem.id, {
                  color: e.target.value
                })
                }
                className="w-9 h-9 rounded-lg cursor-pointer border-0" />

                <input
                type="text"
                value={selectedItem.color}
                onChange={(e) =>
                onUpdate(selectedItem.id, {
                  color: e.target.value
                })
                }
                className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
                Dimensions
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    Width (m)
                  </span>
                  <input
                  type="number"
                  value={selectedItem.width}
                  onChange={(e) =>
                  onUpdate(selectedItem.id, {
                    width: Number(e.target.value)
                  })
                  }
                  step={0.1}
                  min={0.1}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    Height (m)
                  </span>
                  <input
                  type="number"
                  value={selectedItem.height}
                  onChange={(e) =>
                  onUpdate(selectedItem.id, {
                    height: Number(e.target.value)
                  })
                  }
                  step={0.1}
                  min={0.1}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

                </div>
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
                Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    X
                  </span>
                  <input
                  type="number"
                  value={Math.round(selectedItem.position.x)}
                  onChange={(e) =>
                  onUpdate(selectedItem.id, {
                    position: {
                      ...selectedItem.position,
                      x: Number(e.target.value)
                    }
                  })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500">
                    Y
                  </span>
                  <input
                  type="number"
                  value={Math.round(selectedItem.position.y)}
                  onChange={(e) =>
                  onUpdate(selectedItem.id, {
                    position: {
                      ...selectedItem.position,
                      y: Number(e.target.value)
                    }
                  })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

                </div>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-slate-400">
                  Rotation: {Math.round(selectedItem.rotation)}°
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={Math.round(selectedItem.rotation)}
                    onChange={(e) =>
                      onUpdate(selectedItem.id, {
                        rotation: Number(e.target.value) % 360
                      })
                    }
                    className="w-16 px-2 py-1 text-[10px] bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-right text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                  />
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none pr-1">°</span>
                </div>
              </div>
              <input
                type="range"
                value={selectedItem.rotation}
                onChange={(e) =>
                  onUpdate(selectedItem.id, {
                    rotation: Number(e.target.value)
                  })
                }
                min={0}
                max={360}
                step={1}
                className="w-full accent-indigo-600 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-700 space-y-2">
            <button
            onClick={() => onDuplicate(selectedItem)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">

              <CopyIcon className="w-3.5 h-3.5" />
              Duplicate
            </button>
            <button
            onClick={() => onDelete(selectedItem.id)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">

              <TrashIcon className="w-3.5 h-3.5" />
              Delete Item
            </button>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}