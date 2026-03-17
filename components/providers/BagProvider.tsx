"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { BagItem } from "@/components/BagDrawer";

const BAG_KEY = "fitted_bag";

interface BagContextType {
  items: BagItem[];
  addItem: (item: BagItem) => void;
  removeItem: (id: string) => void;
  clearBag: () => void;
  itemCount: number;
}

const BagContext = createContext<BagContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearBag: () => {},
  itemCount: 0,
});

export function useBag() {
  return useContext(BagContext);
}

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BAG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem = useCallback((item: BagItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearBag = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(BAG_KEY); } catch {}
  }, []);

  return (
    <BagContext.Provider
      value={{ items, addItem, removeItem, clearBag, itemCount: items.length }}
    >
      {children}
    </BagContext.Provider>
  );
}
