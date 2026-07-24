import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { MOCK_MENU_ITEMS } from '@/constants/menu';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState(MOCK_MENU_ITEMS);

  useEffect(() => {
    setMenuItems(MOCK_MENU_ITEMS);
  }, [MOCK_MENU_ITEMS]);

  // Add a new menu item
  const addMenuItem = useCallback((newItem) => {
    setMenuItems(prev => [newItem, ...prev]);
  }, []);

  // Update an existing menu item
  const updateMenuItem = useCallback((id, updates) => {
    setMenuItems(prev => 
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);



  // Bulk update multiple menu items
  const bulkUpdate = useCallback((ids, updates) => {
    setMenuItems(prev => 
      prev.map(m => (ids.includes(m.id) ? { ...m, ...updates } : m))
    );
  }, []);

  // Delete completely
  const deleteMenuItem = useCallback((id) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,

        bulkUpdate,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
