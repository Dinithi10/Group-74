import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, GridIcon, RotateCcwIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Scene3D } from '../components/viewer/Scene3D';
export function ViewerPage() {
  const { rooms, currentRoom, setCurrentRoom, furnitureItems } = useApp();
  const [wireframe, setWireframe] = useState(false);
  const activeRoom = currentRoom ?? rooms[0] ?? null;
  const roomItems = furnitureItems.filter(
    (f) => f.roomId === (activeRoom?.id ?? '')
  );
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
      className="flex flex-col h-[calc(100vh-64px)]">

      {/* Controls bar */}
      <div className="h-14 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
            3D Viewer
          </h1>
          <select
            value={activeRoom?.id ?? ''}
            onChange={(e) => {
              const room = rooms.find((r) => r.id === e.target.value);
              if (room) setCurrentRoom(room);
            }}
            className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all">

            {rooms.map((r) =>
            <option key={r.id} value={r.id}>
                {r.name} ({r.width}×{r.length}m)
              </option>
            )}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWireframe((w) => !w)}
            title="Toggle wireframe"
            className={`p-2 rounded-lg text-xs transition-colors ${wireframe ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>

            <GridIcon className="w-4 h-4" />
          </button>
          <button
            title="Reset camera"
            className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">

            <RotateCcwIcon className="w-4 h-4" />
          </button>
          <button
            title="Lighting"
            className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">

            <SunIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Loading 3D Scene...</p>
            </div>
          </div>
        }>
          <Scene3D
            room={activeRoom}
            furnitureItems={roomItems}
            wireframe={wireframe} />
        </Suspense>


        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-medium text-gray-900 dark:text-white">
            {activeRoom?.name ?? 'No room'}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">
            {activeRoom ?
            `${activeRoom.width}×${activeRoom.length}×${activeRoom.height}m` :
            ''}{' '}
            · {roomItems.length} items
          </p>
        </div>

        {/* Controls hint */}
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] text-gray-400 dark:text-slate-500">
            🖱️ Drag to orbit · Scroll to zoom · Right-click to pan
          </p>
        </div>
      </div>
    </motion.div>);

}