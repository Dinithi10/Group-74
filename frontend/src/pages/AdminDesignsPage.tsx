import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  SortDescIcon,
  FolderOpenIcon,
  Trash2Icon,
  AlertTriangleIcon } from
'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ui/ProjectCard';
export function AdminDesignsPage() {
  const { savedDesigns, rooms, deleteDesign, setCurrentRoom } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const filtered = savedDesigns.
  filter((d) => d.name.toLowerCase().includes(search.toLowerCase())).
  sort((a, b) => {
    if (sortBy === 'date') return b.createdAt.localeCompare(a.createdAt);
    return a.name.localeCompare(b.name);
  });
  const handleDelete = (id: string) => {
    deleteDesign(id);
    toast.success('Design deleted');
  };
  const handleDeleteAll = () => {
    // In a real app, this would call a deleteAllDesigns action
    filtered.forEach((design) => deleteDesign(design.id));
    toast.success(
      `${filtered.length} design${filtered.length !== 1 ? 's' : ''} deleted`
    );
    setShowDeleteAllConfirm(false);
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
            All Designs
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            {savedDesigns.length} design{savedDesigns.length !== 1 ? 's' : ''}{' '}
            across all users
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search designs..."
              className="w-56 pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
            <SortDescIcon className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="text-sm bg-transparent text-gray-700 dark:text-slate-300 focus:outline-none">

              <option value="date">Newest first</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
          {filtered.length > 0 &&
          <button
            onClick={() => setShowDeleteAllConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/25">

              <Trash2Icon className="w-4 h-4" />
              Delete All
            </button>
          }
        </div>
      </div>

      {/* Delete All Confirmation */}
      {showDeleteAllConfirm &&
      <motion.div
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">

          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                Delete All Designs?
              </h3>
              <p className="text-xs text-red-700 dark:text-red-400 mb-3">
                This will permanently delete {filtered.length} design
                {filtered.length !== 1 ? 's' : ''}. This action cannot be
                undone.
              </p>
              <div className="flex items-center gap-2">
                <button
                onClick={handleDeleteAll}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors">

                  Yes, Delete All
                </button>
                <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-3 py-1.5 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600">

                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      }

      {/* Grid */}
      {filtered.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((design, i) => {
          const room = rooms.find((r) => r.id === design.roomId);
          return (
            <ProjectCard
              key={design.id}
              id={design.id}
              name={design.name}
              roomName={room?.name}
              date={design.createdAt}
              furnitureCount={design.furnitureCount}
              dimensions={
              room ? `${room.width}m × ${room.length}m` : undefined
              }
              index={i}
              onEdit={() => navigate('/editor')}
              onView3D={() => {
                if (room) setCurrentRoom(room);
                navigate('/viewer');
              }}
              onDelete={() => handleDelete(design.id)} />);


        })}
        </div> :

      <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <FolderOpenIcon className="w-8 h-8 text-gray-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            No designs found
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm">
            {search ?
          'Try a different search term.' :
          'No designs have been created yet.'}
          </p>
        </div>
      }
    </motion.div>);

}