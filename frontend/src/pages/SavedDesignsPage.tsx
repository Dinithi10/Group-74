import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon, SortDescIcon, FolderOpenIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ui/ProjectCard';
import { PriceBreakdownModal } from '../components/ui/PriceBreakdownModal';
import { furnitureCatalog } from '../data/mockData';
export function SavedDesignsPage() {
  const { savedDesigns, rooms, deleteDesign, furnitureItems, addToCart, setCurrentRoom } =
  useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [priceModalDesign, setPriceModalDesign] = useState<{
    id: string;
    name: string;
  } | null>(null);
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
  const handleViewPrice = (designId: string, designName: string) => {
    setPriceModalDesign({
      id: designId,
      name: designName
    });
  };
  const handleAddToCart = () => {
    if (!priceModalDesign) return;
    const designFurniture = furnitureItems.filter(
      (f) =>
      savedDesigns.find((d) => d.id === priceModalDesign.id)?.roomId ===
      f.roomId
    );
    addToCart(priceModalDesign.id, priceModalDesign.name, designFurniture);
    toast.success('Added to cart');
  };
  const calculatePrice = (designId: string) => {
    const design = savedDesigns.find((d) => d.id === designId);
    if (!design) return 0;
    const designFurniture = furnitureItems.filter(
      (f) => f.roomId === design.roomId
    );
    const total = designFurniture.reduce((sum, item) => {
      const catalogItem = furnitureCatalog.find((c) => c.type === item.type);
      return sum + (catalogItem?.price || 0);
    }, 0);
    return total;
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
            Saved Designs
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            {savedDesigns.length} design{savedDesigns.length !== 1 ? 's' : ''}{' '}
            saved
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
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((design, i) => {
          const room = rooms.find((r) => r.id === design.roomId);
          const price = calculatePrice(design.id);
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
              price={price}
              index={i}
              onEdit={() => navigate('/editor')}
              onView3D={() => {
                if (room) setCurrentRoom(room);
                navigate('/viewer');
              }}
              onDelete={() => handleDelete(design.id)}
              onViewPrice={() => handleViewPrice(design.id, design.name)} />);


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
          'Create your first design to get started.'}
          </p>
        </div>
      }

      {/* Price Breakdown Modal */}
      {priceModalDesign &&
      <PriceBreakdownModal
        isOpen={true}
        onClose={() => setPriceModalDesign(null)}
        designName={priceModalDesign.name}
        furnitureItems={furnitureItems.filter(
          (f) =>
          savedDesigns.find((d) => d.id === priceModalDesign.id)?.roomId ===
          f.roomId
        )}
        onAddToCart={handleAddToCart} />

      }
    </motion.div>);

}