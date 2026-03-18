import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  HomeIcon,
  BoxIcon,
  ArmchairIcon,
  PlusIcon } from
'lucide-react';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/ui/StatsCard';
import { ProjectCard } from '../components/ui/ProjectCard';
export function DashboardPage() {
  const { user, savedDesigns, rooms, furnitureItems, setCurrentRoom } = useApp();
  const navigate = useNavigate();
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

      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">
            Here's what's happening with your designs today.
          </p>
        </div>
        <button
          onClick={() => navigate('/create-room')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25">

          <PlusIcon className="w-4 h-4" />
          Create New Design
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatsCard
          icon={<LayoutDashboardIcon className="w-5 h-5" />}
          value={savedDesigns.length}
          label="Total Designs"
          trend={`${savedDesigns.length > 0 ? '+1' : '0'} today`}
          color="#4F46E5"
          index={0} />

        <StatsCard
          icon={<HomeIcon className="w-5 h-5" />}
          value={rooms.length}
          label="Rooms Created"
          trend={`${rooms.length > 0 ? '+1' : '0'} new`}
          color="#8B5CF6"
          index={1} />

        <StatsCard
          icon={<BoxIcon className="w-5 h-5" />}
          value={savedDesigns.length * 2} // Placeholder for views
          label="3D Views"
          trend="+5 views"
          color="#EC4899"
          index={2} />

        <StatsCard
          icon={<ArmchairIcon className="w-5 h-5" />}
          value={furnitureItems.length}
          label="Furniture Items"
          trend={`+${furnitureItems.length} placed`}
          color="#10B981"
          index={3} />

      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Projects
          </h2>
          <button
            onClick={() => navigate('/saved')}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">

            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedDesigns.slice(0, 3).map((design, i) => {
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
                }} />);


          })}
        </div>
      </div>
    </motion.div>);

}