import React, { useCallback, useEffect, useState, useRef } from 'react';
import type { FurnitureItem, Room } from '../../data/mockData';
interface Canvas2DProps {
  room: Room | null;
  furnitureItems: FurnitureItem[];
  selectedId: string | null;
  gridEnabled: boolean;
  snapEnabled: boolean;
  scale: number;
  onSelect: (id: string | null) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onTransform: (id: string, updates: Partial<FurnitureItem>) => void;
  onScaleChange: (scale: number) => void;
  readOnly?: boolean;
}
const GRID_SIZE = 20;
const SCALE_FACTOR = 80; // pixels per meter
const HANDLE_SIZE = 8;
const ROTATE_HANDLE_OFFSET = 24;
interface DragState {
  type:
  'move' |
  'resize-tl' |
  'resize-tr' |
  'resize-bl' |
  'resize-br' |
  'rotate' |
  'pan';
  itemId?: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW?: number;
  origH?: number;
  origRotation?: number;
  centerX?: number;
  centerY?: number;
  startScreenX: number;
  startScreenY: number;
}
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export function Canvas2D({
  room,
  furnitureItems,
  selectedId,
  gridEnabled,
  snapEnabled,
  scale,
  onSelect,
  onUpdatePosition,
  onTransform,
  onScaleChange,
  readOnly = false
}: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600
  });
  const [panOffset, setPanOffset] = useState({
    x: 0,
    y: 0
  });
  const dragRef = useRef<DragState | null>(null);
  const animFrameRef = useRef<number>(0);
  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  // Update canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
  }, [dimensions]);
  const roomWidthPx = (room?.width ?? 6) * SCALE_FACTOR;
  const roomLengthPx = (room?.length ?? 5) * SCALE_FACTOR;
  // Get room offset (centered in canvas, accounting for pan and scale)
  const getRoomOffset = useCallback(() => {
    return {
      x: (dimensions.width / scale - roomWidthPx) / 2,
      y: (dimensions.height / scale - roomLengthPx) / 2
    };
  }, [dimensions, scale, roomWidthPx, roomLengthPx]);
  // Convert screen coords to canvas coords
  const screenToCanvas = useCallback(
    (sx: number, sy: number) => {
      const roomOffset = getRoomOffset();
      return {
        x: (sx - panOffset.x) / scale - roomOffset.x,
        y: (sy - panOffset.y) / scale - roomOffset.y
      };
    },
    [scale, panOffset, getRoomOffset]
  );
  // Get furniture bounding box in canvas coords (accounting for rotation)
  const getFurnitureBounds = useCallback((item: FurnitureItem) => {
    const w = item.width * SCALE_FACTOR;
    const h = item.height * SCALE_FACTOR;
    return {
      x: item.position.x,
      y: item.position.y,
      w,
      h
    };
  }, []);
  // Hit test: is point inside a furniture item?
  const hitTestItem = useCallback(
    (cx: number, cy: number, item: FurnitureItem): boolean => {
      const { x, y, w, h } = getFurnitureBounds(item);
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const rad = -item.rotation * Math.PI / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const dx = cx - centerX;
      const dy = cy - centerY;
      const localX = dx * cos - dy * sin + w / 2;
      const localY = dx * sin + dy * cos + h / 2;
      return localX >= 0 && localX <= w && localY >= 0 && localY <= h;
    },
    [getFurnitureBounds]
  );
  // Hit test resize handles
  const hitTestHandles = useCallback(
    (cx: number, cy: number, item: FurnitureItem): string | null => {
      const { x, y, w, h } = getFurnitureBounds(item);
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const rad = -item.rotation * Math.PI / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const dx = cx - centerX;
      const dy = cy - centerY;
      const localX = dx * cos - dy * sin + w / 2;
      const localY = dx * sin + dy * cos + h / 2;
      const hs = HANDLE_SIZE / scale + 4;
      // Rotate handle (above top center)
      const rotHandleLocalX = w / 2;
      const rotHandleLocalY = -ROTATE_HANDLE_OFFSET / scale;
      if (
      Math.abs(localX - rotHandleLocalX) < hs &&
      Math.abs(localY - rotHandleLocalY) < hs)
      {
        return 'rotate';
      }
      // Corner handles
      if (localX < hs && localY < hs) return 'resize-tl';
      if (localX > w - hs && localY < hs) return 'resize-tr';
      if (localX < hs && localY > h - hs) return 'resize-bl';
      if (localX > w - hs && localY > h - hs) return 'resize-br';
      return null;
    },
    [getFurnitureBounds, scale]
  );
  // Draw everything
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    // Apply pan and scale
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(scale, scale);

    const roomOffset = getRoomOffset();
    ctx.translate(roomOffset.x, roomOffset.y);

    // Draw grid relative to room
    if (gridEnabled) {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 0.5 / scale;
      ctx.globalAlpha = 0.4;
      
      // Grid should still cover the visible area, but drawn relative to room (0,0)
      const startX = Math.floor((-panOffset.x / scale - roomOffset.x) / GRID_SIZE) * GRID_SIZE;
      const startY = Math.floor((-panOffset.y / scale - roomOffset.y) / GRID_SIZE) * GRID_SIZE;
      const endX = startX + dimensions.width / scale + GRID_SIZE * 2;
      const endY = startY + dimensions.height / scale + GRID_SIZE * 2;
      ctx.beginPath();
      for (let x = startX; x <= endX; x += GRID_SIZE) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y <= endY; y += GRID_SIZE) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // Draw room boundary (now at 0,0)
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2 / scale;
    ctx.fillStyle = room?.wallColor ?? '#F5F5F5';
    const rx = 0;
    const ry = 0;
    // Room fill
    ctx.beginPath();
    roundRect(ctx, rx, ry, roomWidthPx, roomLengthPx, 4);
    ctx.fill();
    ctx.stroke();
    // Room label
    ctx.fillStyle = '#94A3B8';
    ctx.font = `${11 / scale > 11 ? 11 : 11}px Inter, system-ui, sans-serif`;
    ctx.fillText(room?.name ?? 'Room', rx + 8, ry + 18);
    // Dimension labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = `${10}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(
      `${room?.width ?? 6}m`,
      rx + roomWidthPx / 2,
      ry + roomLengthPx + 18
    );
    ctx.save();
    ctx.translate(rx + roomWidthPx + 18, ry + roomLengthPx / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`${room?.length ?? 5}m`, 0, 0);
    ctx.restore();
    ctx.textAlign = 'start';
    // Draw furniture items
    for (const item of furnitureItems) {
      const w = item.width * SCALE_FACTOR;
      const h = item.height * SCALE_FACTOR;
      const isSelected = item.id === selectedId;
      ctx.save();
      ctx.translate(item.position.x + w / 2, item.position.y + h / 2);
      ctx.rotate(item.rotation * Math.PI / 180);
      ctx.translate(-w / 2, -h / 2);
      // Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.12)';
      ctx.shadowBlur = isSelected ? 12 : 6;
      ctx.shadowOffsetY = 2;
      // Fill
      ctx.fillStyle = hexToRgba(item.color, 0.85);
      ctx.beginPath();
      roundRect(ctx, 0, 0, w, h, 4);
      ctx.fill();
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      // Selection border
      if (isSelected) {
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 2 / scale;
        ctx.beginPath();
        roundRect(ctx, 0, 0, w, h, 4);
        ctx.stroke();
      }
      // Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `600 ${11}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.type, w / 2, h / 2);
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
      // Draw handles if selected
      if (isSelected) {
        const hs = HANDLE_SIZE;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 1.5 / scale;
        // Corner handles
        const corners = [
        [0, 0],
        [w, 0],
        [0, h],
        [w, h]];

        for (const [hx, hy] of corners) {
          ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
          ctx.strokeRect(hx - hs / 2, hy - hs / 2, hs, hs);
        }
        // Rotate handle
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, -ROTATE_HANDLE_OFFSET);
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 1 / scale;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2, -ROTATE_HANDLE_OFFSET, hs / 2 + 1, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 1.5 / scale;
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }, [
  dimensions,
  panOffset,
  scale,
  gridEnabled,
  room,
  roomWidthPx,
  roomLengthPx,
  furnitureItems,
  selectedId,
  getRoomOffset]
  );
  // Render loop
  useEffect(() => {
    const render = () => {
      draw();
      animFrameRef.current = requestAnimationFrame(render);
    };
    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);
  // Snap helper
  const snapToGrid = useCallback(
    (val: number) =>
    snapEnabled ? Math.round(val / GRID_SIZE) * GRID_SIZE : val,
    [snapEnabled]
  );
  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const { x: cx, y: cy } = screenToCanvas(sx, sy);
      // Check if clicking on selected item's handles first
      if (!readOnly && selectedId) {
        const selItem = furnitureItems.find((f) => f.id === selectedId);
        if (selItem) {
          const handle = hitTestHandles(cx, cy, selItem);
          if (handle === 'rotate') {
            const bounds = getFurnitureBounds(selItem);
            dragRef.current = {
              type: 'rotate',
              itemId: selectedId,
              startX: cx,
              startY: cy,
              origX: selItem.position.x,
              origY: selItem.position.y,
              origRotation: selItem.rotation,
              centerX: bounds.x + bounds.w / 2,
              centerY: bounds.y + bounds.h / 2,
              startScreenX: sx,
              startScreenY: sy
            };
            return;
          }
          if (handle && handle.startsWith('resize-')) {
            const bounds = getFurnitureBounds(selItem);
            dragRef.current = {
              type: handle as DragState['type'],
              itemId: selectedId,
              startX: cx,
              startY: cy,
              origX: selItem.position.x,
              origY: selItem.position.y,
              origW: bounds.w,
              origH: bounds.h,
              startScreenX: sx,
              startScreenY: sy
            };
            return;
          }
        }
      }
      // Check if clicking on any furniture item (reverse order for top-most)
      if (!readOnly) {
        for (let i = furnitureItems.length - 1; i >= 0; i--) {
          const item = furnitureItems[i];
          if (hitTestItem(cx, cy, item)) {
            onSelect(item.id);
            dragRef.current = {
              type: 'move',
              itemId: item.id,
              startX: cx,
              startY: cy,
              origX: item.position.x,
              origY: item.position.y,
              startScreenX: sx,
              startScreenY: sy
            };
            return;
          }
        }
      }
      // Click on empty space — deselect and start pan
      if (!readOnly) onSelect(null);
      dragRef.current = {
        type: 'pan',
        startX: sx,
        startY: sy,
        origX: panOffset.x,
        origY: panOffset.y,
        startScreenX: sx,
        startScreenY: sy
      };
    },
    [
    screenToCanvas,
    furnitureItems,
    selectedId,
    hitTestItem,
    hitTestHandles,
    getFurnitureBounds,
    onSelect,
    panOffset]

  );
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const { x: cx, y: cy } = screenToCanvas(sx, sy);
      if (drag.type === 'pan') {
        setPanOffset({
          x: drag.origX + (sx - drag.startX),
          y: drag.origY + (sy - drag.startY)
        });
        return;
      }
      if (drag.type === 'move' && drag.itemId) {
        const dx = (sx - drag.startScreenX) / scale;
        const dy = (sy - drag.startScreenY) / scale;
        const newX = snapToGrid(drag.origX + dx);
        const newY = snapToGrid(drag.origY + dy);
        onUpdatePosition(drag.itemId, newX, newY);
        return;
      }
      if (
      drag.type === 'rotate' &&
      drag.itemId &&
      drag.centerX !== undefined &&
      drag.centerY !== undefined)
      {
        const startAngle = Math.atan2(
          drag.startY - drag.centerY,
          drag.startX - drag.centerX
        );
        const currentAngle = Math.atan2(cy - drag.centerY, cx - drag.centerX);
        const angleDiff = (currentAngle - startAngle) * 180 / Math.PI;
        let newRotation = (drag.origRotation ?? 0) + angleDiff;
        if (snapEnabled) newRotation = Math.round(newRotation / 15) * 15;
        onTransform(drag.itemId, {
          rotation: newRotation
        });
        return;
      }
      if (
      drag.type.startsWith('resize-') &&
      drag.itemId &&
      drag.origW &&
      drag.origH)
      {
        const dx = (sx - drag.startScreenX) / scale;
        const dy = (sy - drag.startScreenY) / scale;
        let newW = drag.origW;
        let newH = drag.origH;
        let newX = drag.origX;
        let newY = drag.origY;
        if (drag.type === 'resize-br') {
          newW = Math.max(20, drag.origW + dx);
          newH = Math.max(20, drag.origH + dy);
        } else if (drag.type === 'resize-bl') {
          newW = Math.max(20, drag.origW - dx);
          newH = Math.max(20, drag.origH + dy);
          newX = drag.origX + dx;
        } else if (drag.type === 'resize-tr') {
          newW = Math.max(20, drag.origW + dx);
          newH = Math.max(20, drag.origH - dy);
          newY = drag.origY + dy;
        } else if (drag.type === 'resize-tl') {
          newW = Math.max(20, drag.origW - dx);
          newH = Math.max(20, drag.origH - dy);
          newX = drag.origX + dx;
          newY = drag.origY + dy;
        }
        onTransform(drag.itemId, {
          position: {
            x: snapToGrid(newX),
            y: snapToGrid(newY)
          },
          width: newW / SCALE_FACTOR,
          height: newH / SCALE_FACTOR
        });
        return;
      }
    },
    [screenToCanvas, snapToGrid, snapEnabled, onUpdatePosition, onTransform]
  );
  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);
  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const scaleBy = 1.08;
      const newScale = e.deltaY < 0 ? scale * scaleBy : scale / scaleBy;
      const clampedScale = Math.max(0.3, Math.min(3, newScale));
      onScaleChange(clampedScale);
    },
    [scale, onScaleChange]
  );
  // Delete key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        onTransform(selectedId, {}); // Signal delete through parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, onTransform]);
  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-100 dark:bg-slate-900 relative overflow-hidden cursor-crosshair">

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="block" />


      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg text-[10px] font-mono text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
        {Math.round(scale * 100)}%
      </div>
    </div>);

}
// Helper: draw rounded rectangle
function roundRect(
ctx: CanvasRenderingContext2D,
x: number,
y: number,
w: number,
h: number,
r: number)
{
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}