import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Undo2Icon,
  Redo2Icon,
  ZoomInIcon,
  ZoomOutIcon,
  MaximizeIcon,
  GridIcon,
  MagnetIcon,
  SaveIcon,
  BoxIcon } from
'lucide-react';
interface EditorToolbarProps {
  gridEnabled: boolean;
  snapEnabled: boolean;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}
function ToolButton({
  icon,
  label,
  onClick,
  active,
  disabled
}: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`relative p-2 rounded-lg transition-colors ${disabled ? 'opacity-40 cursor-not-allowed text-gray-400 dark:text-slate-600' : active ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200'}`}>

      {icon}
    </button>);

}
export function EditorToolbar({
  gridEnabled,
  snapEnabled,
  onToggleGrid,
  onToggleSnap,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: EditorToolbarProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="h-12 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between px-4">

      <div className="flex items-center gap-1">
        <ToolButton
          icon={<Undo2Icon className="w-4 h-4" />}
          label="Undo (Ctrl+Z)"
          onClick={onUndo}
          disabled={!canUndo} />

        <ToolButton
          icon={<Redo2Icon className="w-4 h-4" />}
          label="Redo (Ctrl+Shift+Z)"
          onClick={onRedo}
          disabled={!canRedo} />


        <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-2" />

        <ToolButton
          icon={<ZoomInIcon className="w-4 h-4" />}
          label="Zoom In"
          onClick={onZoomIn} />

        <ToolButton
          icon={<ZoomOutIcon className="w-4 h-4" />}
          label="Zoom Out"
          onClick={onZoomOut} />

        <ToolButton
          icon={<MaximizeIcon className="w-4 h-4" />}
          label="Reset Zoom"
          onClick={onResetZoom} />


        <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-2" />

        <ToolButton
          icon={<GridIcon className="w-4 h-4" />}
          label="Toggle Grid"
          onClick={onToggleGrid}
          active={gridEnabled} />

        <ToolButton
          icon={<MagnetIcon className="w-4 h-4" />}
          label="Snap to Grid"
          onClick={onToggleSnap}
          active={snapEnabled} />

      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm">

          <SaveIcon className="w-3.5 h-3.5" />
          Save
        </button>
        <button
          onClick={() => navigate('/viewer')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">

          <BoxIcon className="w-3.5 h-3.5" />
          View 3D
        </button>
      </div>
    </motion.div>);

}