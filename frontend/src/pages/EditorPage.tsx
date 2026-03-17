import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { FurnitureLibrary } from '../components/editor/FurnitureLibrary';
import { Canvas2D } from '../components/editor/Canvas2D';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import type { FurnitureCatalogItem, FurnitureItem } from '../data/mockData';
export function EditorPage() {
  const {
    currentRoom,
    user,
    furnitureItems,
    selectedFurnitureId,
    selectFurniture,
    addFurniture,
    updateFurniture,
    removeFurniture,
    saveDesign,
    saveHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useApp();
  const [gridEnabled, setGridEnabled] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [scale, setScale] = useState(1);
  const selectedItem =
  furnitureItems.find((f) => f.id === selectedFurnitureId) ?? null;
  const roomItems = furnitureItems.filter(
    (f) => f.roomId === currentRoom?.id
  );
  const handleAddFromLibrary = useCallback(
    async (catalogItem: FurnitureCatalogItem) => {
      if (!currentRoom) {
        toast.error('Please create or select a room first');
        return;
      }
      const newItem: any = {
        type: catalogItem.type,
        width: catalogItem.defaultWidth,
        height: catalogItem.defaultHeight,
        depth: catalogItem.defaultDepth,
        color: catalogItem.defaultColor,
        position: {
          x: 20,
          y: 20
        },
        rotation: 0,
        roomId: currentRoom?.id
      };
      await addFurniture(newItem);
      // Backend returns the item with ID, but AppContext adds to state. 
      // Current selectFurniture expects an ID. AppContext might need to be improved to return the new item.
      saveHistory();
    },
    [addFurniture, currentRoom, saveHistory]
  );
  const handleDuplicate = useCallback(
    async (item: FurnitureItem) => {
      const dup: any = {
        ...item,
        position: {
          x: item.position.x + 30,
          y: item.position.y + 30
        }
      };
      delete dup.id; // Let backend generate new ID
      delete dup._id;
      await addFurniture(dup);
      saveHistory();
    },
    [addFurniture, saveHistory]
  );
  const handleDelete = useCallback(
    async (id: string) => {
      removeFurniture(id);
      saveHistory();
      toast.success('Item removed');
    },
    [removeFurniture, saveHistory]
  );
  const handleUpdatePosition = useCallback(
    (id: string, x: number, y: number) => {
      updateFurniture(id, {
        position: {
          x,
          y
        }
      });
      // In a real app, we might debounce an API call here to save the new position
    },
    [updateFurniture]
  );
  const handleTransform = useCallback(
    (id: string, updates: Partial<FurnitureItem>) => {
      updateFurniture(id, updates);
    },
    [updateFurniture]
  );
  // Save history when drag/transform ends (debounced)
  useEffect(() => {
    let timeoutId: any;
    const handleMouseUp = () => {
      timeoutId = setTimeout(() => {
        saveHistory();
      }, 300);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(timeoutId);
    };
  }, [saveHistory]);
  const handleSave = useCallback(async () => {
    if (!currentRoom) return;
    const design: any = {
      name: `Design for ${currentRoom.name}`,
      roomId: currentRoom.id,
      furnitureCount: roomItems.length,
      thumbnail: '', // Placeholder or capture canvas
      userId: user?.id
    };
    await saveDesign(design);
  }, [currentRoom, roomItems.length, saveDesign, user?.id]);
  const handleUndo = useCallback(() => {
    undo();
    toast.info('Undo');
  }, [undo]);
  const handleRedo = useCallback(() => {
    redo();
    toast.info('Redo');
  }, [redo]);
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      transition={{
        duration: 0.3
      }}
      className="flex flex-col h-[calc(100vh-64px)]">

      {user?.role !== 'Viewer' && (
        <EditorToolbar
          gridEnabled={gridEnabled}
          snapEnabled={snapEnabled}
          onToggleGrid={() => setGridEnabled((p) => !p)}
          onToggleSnap={() => setSnapEnabled((p) => !p)}
          onZoomIn={() => setScale((s) => Math.min(3, s * 1.2))}
          onZoomOut={() => setScale((s) => Math.max(0.3, s / 1.2))}
          onResetZoom={() => setScale(1)}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo} />
      )}


      <div className="flex flex-1 overflow-hidden">
        {user?.role !== 'Viewer' && <FurnitureLibrary onAddFurniture={handleAddFromLibrary} />}

        <Canvas2D
          room={currentRoom}
          furnitureItems={roomItems}
          selectedId={selectedFurnitureId}
          gridEnabled={gridEnabled}
          snapEnabled={snapEnabled}
          scale={scale}
          onSelect={selectFurniture}
          onUpdatePosition={handleUpdatePosition}
          onTransform={handleTransform}
          onScaleChange={setScale}
          readOnly={user?.role === 'Viewer'} />


        {user?.role !== 'Viewer' && (
          <PropertiesPanel
            selectedItem={selectedItem}
            onUpdate={updateFurniture}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onDeselect={() => selectFurniture(null)} />
        )}

      </div>
    </motion.div>);

}