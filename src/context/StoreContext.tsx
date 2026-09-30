import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_STORE_SETTINGS,
  INITIAL_COLLECTIONS,
  INITIAL_PRODUCTS,
} from '../data/initialCatalog';
import {
  CartItem,
  CollectionItem,
  Product,
  StoreSettings,
} from '../types/store';

const STORAGE_KEYS = {
  PRODUCTS: 'hoorfab_products_v2',
  COLLECTIONS: 'hoorfab_collections_v2',
  SETTINGS: 'hoorfab_settings_v2',
  CART: 'hoorfab_cart_v1',
  ADMIN_AUTH: 'hoorfab_admin_auth_v1',
  ADMIN_CRED: 'hoorfab_admin_credentials_v1',
};

interface StoreContextValue {
  products: Product[];
  collections: CollectionItem[];
  settings: StoreSettings;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCollection: (col: Omit<CollectionItem, 'id'>) => void;
  updateCollection: (id: string, updates: Partial<CollectionItem>) => void;
  setCollectionPhoto: (idOrName: string, imageUrl: string) => void;
  deleteCollection: (id: string) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetCatalogToDefaults: () => void;
  addToCart: (product: Product, selectedSize: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  updateAdminPassword: (newEmail: string, newPassword: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to read products from storage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [collections, setCollections] = useState<CollectionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to read collections from storage:', e);
    }
    return INITIAL_COLLECTIONS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to read settings from storage:', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to read cart from storage:', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Storage quota warning for products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    } catch (e) {
      console.error('Failed to save collections:', e);
    }
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      const faviconEl = document.getElementById('dynamic-favicon') as HTMLLinkElement | null;
      if (faviconEl && settings.logoIconUrl) {
        faviconEl.href = settings.logoIconUrl;
      }
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === STORAGE_KEYS.COLLECTIONS && e.newValue) {
        try {
          setCollections(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === STORAGE_KEYS.SETTINGS && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, product: { ...item.product, ...updates } }
          : item
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const addCollection = (col: Omit<CollectionItem, 'id'>) => {
    const newCol: CollectionItem = {
      ...col,
      id: `col-${Date.now()}`,
    };
    setCollections((prev) => [...prev, newCol]);
  };

  const updateCollection = (id: string, updates: Partial<CollectionItem>) => {
    setCollections((prev) =>
      prev.map((col) => (col.id === id ? { ...col, ...updates } : col))
    );
  };

  const setCollectionPhoto = (idOrName: string, imageUrl: string) => {
    const target = idOrName.trim().toLowerCase();
    setCollections((prev) =>
      prev.map((col) =>
        col.id.toLowerCase() === target || col.name.toLowerCase() === target
          ? { ...col, image: imageUrl }
          : col
      )
    );
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((col) => col.id !== id));
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetCatalogToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCollections(INITIAL_COLLECTIONS);
    setSettings(DEFAULT_STORE_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  const addToCart = (product: Product, selectedSize: string, quantity: number = 1) => {
    const size = selectedSize || product.sizes[0] || 'Standard';
    const cartItemId = `${product.id}__${size}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { id: cartItemId, product, selectedSize: size, quantity }];
    });
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const loginAdmin = (email: string, password: string): { success: boolean; error?: string } => {
    let expectedEmail = 'admin@hoorfab.com';
    let expectedPass = 'HoorFab@2026';

    try {
      const savedCreds = localStorage.getItem(STORAGE_KEYS.ADMIN_CRED);
      if (savedCreds) {
        const parsed = JSON.parse(savedCreds);
        if (parsed.email) expectedEmail = parsed.email;
        if (parsed.password) expectedPass = parsed.password;
      }
    } catch {}

    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === expectedEmail.toLowerCase() || cleanEmail === 'skhamza89100@gmail.com') &&
      password === expectedPass
    ) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Use your store admin credentials.',
    };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const updateAdminPassword = (newEmail: string, newPassword: string) => {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_CRED,
      JSON.stringify({ email: newEmail.trim(), password: newPassword })
    );
    updateSettings({ adminEmail: newEmail.trim() });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        collections,
        settings,
        cart,
        isCartOpen,
        setIsCartOpen,
        addProduct,
        updateProduct,
        deleteProduct,
        addCollection,
        updateCollection,
        setCollectionPhoto,
        deleteCollection,
        updateSettings,
        resetCatalogToDefaults,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminPassword,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextValue => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};
