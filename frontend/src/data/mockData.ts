// ==========================================
// Types
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  width: number;
  length: number;
  height: number;
  wallColor: string;
  floorMaterial: string;
  createdAt: string;
}

export interface FurnitureItem {
  id: string;
  type: string;
  width: number;
  height: number;
  depth: number;
  color: string;
  position: {x: number;y: number;};
  rotation: number;
  roomId: string;
}

export interface SavedDesign {
  id: string;
  name: string;
  roomId: string;
  thumbnail: string;
  createdAt: string;
  furnitureCount: number;
}

export interface FurnitureCatalogItem {
  type: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  defaultColor: string;
  category: string;
  price: number;
}

export interface FurniturePrice {
  type: string;
  price: number;
  category: string;
}

export interface CartItem {
  id: string;
  designId: string;
  designName: string;
  furnitureItems: FurnitureItem[];
  subtotal: number;
  designCharge: number;
  tax: number;
  total: number;
  addedAt: string;
}

// ==========================================
// Constants
// ==========================================

export const furnitureCatalog: FurnitureCatalogItem[] = [
{
  type: 'Chair',
  icon: '🪑',
  defaultWidth: 0.6,
  defaultHeight: 0.6,
  defaultDepth: 0.8,
  defaultColor: '#10B981',
  category: 'Seating',
  price: 150
},
{
  type: 'Sofa',
  icon: '🛋️',
  defaultWidth: 2,
  defaultHeight: 1,
  defaultDepth: 1,
  defaultColor: '#8B5CF6',
  category: 'Seating',
  price: 850
},
{
  type: 'Dining Table',
  icon: '🍽️',
  defaultWidth: 2,
  defaultHeight: 1.2,
  defaultDepth: 1,
  defaultColor: '#F59E0B',
  category: 'Tables',
  price: 650
},
{
  type: 'Side Table',
  icon: '🔲',
  defaultWidth: 0.5,
  defaultHeight: 0.5,
  defaultDepth: 0.6,
  defaultColor: '#6366F1',
  category: 'Tables',
  price: 120
},
{
  type: 'Bed',
  icon: '🛏️',
  defaultWidth: 2,
  defaultHeight: 2.2,
  defaultDepth: 0.6,
  defaultColor: '#EC4899',
  category: 'Bedroom',
  price: 1200
},
{
  type: 'Wardrobe',
  icon: '🚪',
  defaultWidth: 1.5,
  defaultHeight: 2,
  defaultDepth: 0.6,
  defaultColor: '#78716C',
  category: 'Storage',
  price: 950
}];

export const DESIGN_SERVICE_CHARGE = 200;
export const TAX_RATE = 0.08;

export const gradientThumbnails = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
];

export const floorMaterials = ['Wood', 'Carpet', 'Tile', 'Marble', 'Concrete'];
export const roomShapes = ['Rectangle', 'L-Shape', 'Square'];