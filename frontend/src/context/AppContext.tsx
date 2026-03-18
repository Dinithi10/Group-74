import { useCallback, useState, createContext, useContext, ReactNode, useEffect } from 'react';
import {
  type Room,
  type FurnitureItem,
  type SavedDesign,
  type CartItem,
  furnitureCatalog,
  DESIGN_SERVICE_CHARGE,
  TAX_RATE } from
  '../data/mockData';
import { api } from '../services/api';
import { toast } from 'sonner';
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Designer' | 'Viewer';
  avatar?: string;
}

// Extended User type for admin management
export interface AdminUser extends User {
  joinedDate: string;
  designCount: number;
  status: 'Active' | 'Inactive';
}
// History state for undo/redo
interface HistoryState {
  furnitureItems: FurnitureItem[];
}
interface AppState {
  theme: 'light' | 'dark';
  user: User | null;
  rooms: Room[];
  currentRoom: Room | null;
  furnitureItems: FurnitureItem[];
  selectedFurnitureId: string | null;
  savedDesigns: SavedDesign[];
  sidebarCollapsed: boolean;
  adminUsers: AdminUser[];
  cart: CartItem[];
  initializing: boolean;
  // Undo/Redo state
  history: HistoryState[];
  historyIndex: number;
}
interface AppActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addRoom: (room: Room) => Promise<void>;
  setCurrentRoom: (room: Room | null) => void;
  addFurniture: (item: FurnitureItem) => Promise<void>;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  selectFurniture: (id: string | null) => void;
  saveDesign: (design: SavedDesign) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
  // Admin user management
  addAdminUser: (
  user: Omit<AdminUser, 'id' | 'joinedDate' | 'designCount'> & { password?: string })
  => Promise<void>;
  updateAdminUser: (id: string, updates: Partial<AdminUser> & { password?: string }) => Promise<void>;
  deleteAdminUser: (id: string) => Promise<void>;
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveHistory: () => void;
  addToCart: (
  designId: string,
  designName: string,
  furnitureItems: FurnitureItem[])
  => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}
type AppContextType = AppState & AppActions;
const AppContext = createContext<AppContextType | null>(null);
const MAX_HISTORY = 50;
export function AppProvider({ children }: {children: ReactNode;}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoomState] = useState<Room | null>(null);
  const [furnitureItems, setFurnitureItems] =
  useState<FurnitureItem[]>([]);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(
    null
  );
  const [savedDesigns, setSavedDesigns] =
  useState<SavedDesign[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  // Undo/Redo state
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [initializing, setInitializing] = useState(true);

  const refreshData = useCallback(async (token: string | null) => {
    try {
      const [roomsData, designsData] = await Promise.all([
        api.rooms.getAll(),
        api.designs.getAll()
      ]);
      setRooms(roomsData);
      setSavedDesigns(designsData);
      
      if (roomsData.length > 0 && !currentRoom) {
        setCurrentRoomState(roomsData[0]);
      }

      // Only fetch users if we have a token (logged in as Admin)
      if (token) {
        try {
          const usersData = await api.auth.getUsers(token);
          setAdminUsers(usersData);
        } catch (err) {
          console.error('Failed to fetch admin users:', err);
          setAdminUsers([]);
        }
      }
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  }, [currentRoom]);

  // Fetch data on initialization
  useEffect(() => {
    const initData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            const initialUser = await api.auth.getProfile(token);
            setUser(initialUser);
            // Refresh protected data with token
            await refreshData(token);
          } catch (err) {
            console.error('Session restoration failed:', err);
            localStorage.removeItem('token');
            await refreshData(null);
          }
        } else {
          await refreshData(null);
        }
      } finally {
        setInitializing(false);
      }
    };
    initData();
  }, []); // Only run once on mount

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { user, token } = await api.auth.login({ email, password });
      setUser(user);
      localStorage.setItem('token', token);
      
      // Critical: fetch data immediately after login
      await refreshData(token);
      
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, [refreshData]);

  const logout = useCallback(() => {
    setUser(null);
    setAdminUsers([]);
    localStorage.removeItem('token');
  }, []);

  // Fetch furniture when current room changes
  useEffect(() => {
    if (currentRoom?.id) {
      const fetchFurniture = async () => {
        try {
          const furniture = await api.furniture.getByRoom(currentRoom.id);
          setFurnitureItems(furniture);
        } catch (err) {
          console.error('Failed to fetch furniture:', err);
        }
      };
      fetchFurniture();
    } else {
      setFurnitureItems([]);
    }
  }, [currentRoom]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const addRoom = useCallback(async (room: Room) => {
    try {
      const newRoom = await api.rooms.create(room);
      setRooms((prev) => [...prev, newRoom]);
      setCurrentRoomState(newRoom);
    } catch (err) {
      toast.error('Failed to create room');
    }
  }, []);

  const setCurrentRoom = useCallback((room: Room | null) => {
    setCurrentRoomState(room);
  }, []);

  const saveHistory = useCallback(() => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({
        furnitureItems: [...furnitureItems]
      });
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [furnitureItems, historyIndex]);

  const addFurniture = useCallback(async (item: FurnitureItem) => {
    try {
      const newFurniture = await api.furniture.add(item);
      setFurnitureItems((prev) => [...prev, newFurniture]);
    } catch (err) {
      toast.error('Failed to add furniture');
    }
  }, []);

  const updateFurniture = useCallback(
    (id: string, updates: Partial<FurnitureItem>) => {
      setFurnitureItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
    },
    []
  );

  const removeFurniture = useCallback((id: string) => {
    setFurnitureItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedFurnitureId((prev) => (prev === id ? null : prev));
  }, []);

  const selectFurniture = useCallback((id: string | null) => {
    setSelectedFurnitureId(id);
  }, []);

  const saveDesign = useCallback(async (design: SavedDesign) => {
    try {
      const newDesign = await api.designs.create(design);
      setSavedDesigns((prev) => [newDesign, ...prev]);
      toast.success('Design saved successfully');
    } catch (err) {
      toast.error('Failed to save design');
    }
  }, []);

  const deleteDesign = useCallback(async (id: string) => {
    try {
      await api.designs.delete(id);
      setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
      toast.success('Design deleted');
    } catch (err) {
      toast.error('Failed to delete design');
    }
  }, []);

  // Admin user management
  const addAdminUser = useCallback(
    async (userData: Omit<AdminUser, 'id' | 'joinedDate' | 'designCount'> & { password?: string }) => {
      try {
        const newUser = await api.auth.register(userData);
        setAdminUsers((prev) => [newUser.user, ...prev]);
        toast.success('User added successfully');
      } catch (err) {
        toast.error('Failed to add user');
      }
    },
    []
  );

  const updateAdminUser = useCallback(
    async (id: string, updates: Partial<AdminUser> & { password?: string }) => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const updatedUser = await api.auth.updateUser(id, updates, token);
        setAdminUsers((prev) =>
          prev.map((user) => (user.id === id ? updatedUser : user))
        );
        toast.success('User updated successfully');
      } catch (err) {
        toast.error('Failed to update user');
      }
    },
    []
  );

  const deleteAdminUser = useCallback(async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await api.auth.deleteUser(id, token);
      setAdminUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  }, []);
  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFurnitureItems(history[newIndex].furnitureItems);
      setSelectedFurnitureId(null);
    }
  }, [history, historyIndex]);
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFurnitureItems(history[newIndex].furnitureItems);
      setSelectedFurnitureId(null);
    }
  }, [history, historyIndex]);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const addToCart = useCallback(
    (designId: string, designName: string, furnitureItems: FurnitureItem[]) => {
      // Calculate prices
      const itemsWithPrices = furnitureItems.map((item) => {
        const catalogItem = furnitureCatalog.find((c) => c.type === item.type);
        return catalogItem?.price || 0;
      });
      const subtotal = itemsWithPrices.reduce((sum, price) => sum + price, 0);
      const designCharge = DESIGN_SERVICE_CHARGE;
      const tax = (subtotal + designCharge) * TAX_RATE;
      const total = subtotal + designCharge + tax;
      const cartItem: CartItem = {
        id: `cart-${Date.now()}`,
        designId,
        designName,
        furnitureItems,
        subtotal,
        designCharge,
        tax,
        total,
        addedAt: new Date().toISOString()
      };
      setCart((prev) => [...prev, cartItem]);
    },
    []
  );
  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  const value: AppContextType = {
    theme,
    user,
    rooms,
    currentRoom,
    furnitureItems,
    selectedFurnitureId,
    savedDesigns,
    sidebarCollapsed,
    adminUsers,
    cart,
    initializing,
    history,
    historyIndex,
    login,
    logout,
    toggleTheme,
    toggleSidebar,
    addRoom,
    setCurrentRoom,
    addFurniture,
    updateFurniture,
    removeFurniture,
    selectFurniture,
    saveDesign,
    deleteDesign,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    undo,
    redo,
    canUndo,
    canRedo,
    saveHistory,
    addToCart,
    removeFromCart,
    clearCart
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}