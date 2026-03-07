"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { BagItem } from "@/components/BagDrawer";

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
  }, []);

  return (
    <BagContext.Provider
      value={{ items, addItem, removeItem, clearBag, itemCount: items.length }}
    >
      {children}
    </BagContext.Provider>
  );
}
