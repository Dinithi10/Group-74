import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, EyeIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { floorMaterials, roomShapes, type Room } from '../data/mockData';
export function RoomCreationPage() {
  const { addRoom, setCurrentRoom } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [width, setWidth] = useState(5);
  const [length, setLength] = useState(4);
  const [height, setHeight] = useState(3);
  const [shape, setShape] = useState('Rectangle');
  const [wallColor, setWallColor] = useState('#F5F5F5');
  const [floorMaterial, setFloorMaterial] = useState('Wood');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Room name is required';
    if (width <= 0 || width > 20) newErrors.width = 'Width must be 1-20m';
    if (length <= 0 || length > 20) newErrors.length = 'Length must be 1-20m';
    if (height <= 0 || height > 10) newErrors.height = 'Height must be 1-10m';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleCreate = async () => {
    if (!validate()) return;
    const room: any = {
      name: name.trim(),
      width,
      length,
      height,
      wallColor,
      floorMaterial
    };
    await addRoom(room);
    toast.success('Room created successfully!');
    navigate('/editor');
  };
  const maxDim = Math.max(width, length);
  const previewScale = maxDim > 0 ? 200 / maxDim : 40;
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

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Create New Room
      </h1>
      <p className="text-gray-500 dark:text-slate-400 text-sm mb-8">
        Define your room dimensions and style to start designing.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6 space-y-5">
          {/* Room Name */}
          <div>
            <label
              htmlFor="roomName"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

              Room Name
            </label>
            <input
              id="roomName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Living Room"
              className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />

            {errors.name &&
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            }
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="roomWidth"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                Width (m)
              </label>
              <input
                id="roomWidth"
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                min={1}
                max={20}
                step={0.5}
                className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />

              {errors.width &&
              <p className="text-xs text-red-500 mt-1">{errors.width}</p>
              }
            </div>
            <div>
              <label
                htmlFor="roomLength"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                Length (m)
              </label>
              <input
                id="roomLength"
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                min={1}
                max={20}
                step={0.5}
                className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />

              {errors.length &&
              <p className="text-xs text-red-500 mt-1">{errors.length}</p>
              }
            </div>
            <div>
              <label
                htmlFor="roomHeight"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

                Height (m)
              </label>
              <input
                id="roomHeight"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={1}
                max={10}
                step={0.5}
                className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" />

              {errors.height &&
              <p className="text-xs text-red-500 mt-1">{errors.height}</p>
              }
            </div>
          </div>

          {/* Room Shape */}
          <div>
            <label
              htmlFor="roomShape"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

              Room Shape
            </label>
            <select
              id="roomShape"
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all">

              {roomShapes.map((s) =>
              <option key={s} value={s}>
                  {s}
                </option>
              )}
            </select>
          </div>

          {/* Wall Color */}
          <div>
            <label
              htmlFor="wallColor"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

              Wall Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="wallColor"
                type="color"
                value={wallColor}
                onChange={(e) => setWallColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0" />

              <input
                type="text"
                value={wallColor}
                onChange={(e) => setWallColor(e.target.value)}
                className="flex-1 px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-mono" />

            </div>
          </div>

          {/* Floor Material */}
          <div>
            <label
              htmlFor="floorMat"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">

              Floor Material
            </label>
            <select
              id="floorMat"
              value={floorMaterial}
              onChange={(e) => setFloorMaterial(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all">

              {floorMaterials.map((m) =>
              <option key={m} value={m}>
                  {m}
                </option>
              )}
            </select>
          </div>

          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 mt-2">

            <PlusIcon className="w-4 h-4" />
            Create Room
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <EyeIcon className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
              Room Preview
            </h2>
          </div>

          <div className="flex items-center justify-center h-72 bg-gray-50 dark:bg-slate-700/50 rounded-xl relative overflow-hidden">
            {/* Room outline */}
            <div
              className="border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg relative transition-all duration-300"
              style={{
                width: width * previewScale,
                height: length * previewScale,
                backgroundColor: wallColor
              }}>

              {/* Dimension labels */}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-slate-400 font-mono">
                {width}m
              </span>
              <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-slate-400 font-mono rotate-90">
                {length}m
              </span>
              {/* Floor material label */}
              <span className="absolute bottom-2 right-2 text-[10px] text-gray-400 dark:text-slate-500 bg-white/80 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                {floorMaterial}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3">
              <p className="text-gray-400 dark:text-slate-500 text-xs">Shape</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {shape}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3">
              <p className="text-gray-400 dark:text-slate-500 text-xs">
                Height
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {height}m
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3">
              <p className="text-gray-400 dark:text-slate-500 text-xs">Area</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {(width * length).toFixed(1)} m²
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3">
              <p className="text-gray-400 dark:text-slate-500 text-xs">
                Volume
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {(width * length * height).toFixed(1)} m³
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}