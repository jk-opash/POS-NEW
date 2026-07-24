import React, { createContext, useContext, useState } from 'react';

// Statuses: Available, Occupied, Reserved
const MOCK_FLOORS = [
  { id: 'F1', name: '1st Floor' },
  { id: 'F2', name: '2nd Floor' },
  { id: 'F3', name: '3rd Floor' },
];

const MOCK_TABLES = [
  // 1st Floor - Row 1 (y: 50)
  { id: 'T1', name: 'A1', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 50, y: 50 },
  { id: 'T2', name: 'A2', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 200, y: 50 },
  { id: 'T3', name: 'A3', capacity: 6, floorId: 'F1', status: 'Available', span: 2, x: 350, y: 50 },
  { id: 'T4', name: 'A4', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 600, y: 50 },
  { id: 'T5', name: 'A5', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 750, y: 50 },

  // 1st Floor - Row 2 (y: 200)
  { id: 'T6', name: 'A6', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 50, y: 200 },
  { id: 'T7', name: 'A7', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 200, y: 200 },
  { id: 'T8', name: 'A8', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 350, y: 200 },
  { id: 'T9', name: 'A9', capacity: 6, floorId: 'F1', status: 'Available', span: 2, x: 500, y: 200 },
  { id: 'T10', name: 'A10', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 750, y: 200 },

  // 1st Floor - Row 3 (y: 350)
  { id: 'T11', name: 'A11', capacity: 4, floorId: 'F1', status: 'Available', span: 1, x: 50, y: 350 },
  { id: 'T12', name: 'A12', capacity: 6, floorId: 'F1', status: 'Available', span: 2, x: 200, y: 350 },
  { id: 'T13', name: 'A13', capacity: 4, floorId: 'F1', status: 'Available', span: 1, x: 450, y: 350 },
  { id: 'T14', name: 'A14', capacity: 4, floorId: 'F1', status: 'Available', span: 1, x: 600, y: 350 },
  { id: 'T15', name: 'A15', capacity: 4, floorId: 'F1', status: 'Available', span: 1, x: 750, y: 350 },

  // 2nd Floor (Sample)
  { id: 'T16', name: 'B1', capacity: 4, floorId: 'F2', status: 'Available', span: 1, x: 50, y: 50 },
  { id: 'T17', name: 'B2', capacity: 4, floorId: 'F2', status: 'Available', span: 1, x: 200, y: 50 },
];

const TablesContext = createContext();

export function TablesProvider({ children }) {
  const [floors, setFloors] = useState(MOCK_FLOORS);
  const [tables, setTables] = useState(MOCK_TABLES);

  const updateTableStatus = (tableId, newStatus) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
  };

  const updateTablePosition = (tableId, x, y) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, x, y } : t));
  };

  const updateTableRotation = (tableId, rotation) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, rotation } : t));
  };

  const addTable = (floorId, config) => {
    const newId = `T${Date.now()}`;
    const newTable = {
      id: newId,
      name: config.name || `New`,
      floorId,
      status: 'Available',
      rotation: 0,
      x: 100,
      y: 100,
      ...config,
    };
    setTables(prev => [...prev, newTable]);
  };

  const updateTableDetails = (tableId, newDetails) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, ...newDetails } : t));
  };

  const deleteTable = (tableId) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
  };

  const mergeTables = (tableIds) => {
    if (!tableIds || tableIds.length < 2) return;
    
    setTables(prev => {
      const tablesToMerge = prev.filter(t => tableIds.includes(t.id));
      if (tablesToMerge.length < 2) return prev;
      
      const newName = tablesToMerge.map(t => t.name).join('+');
      const newCapacity = tablesToMerge.reduce((sum, t) => sum + (t.capacity || 0), 0);
      
      const avgX = tablesToMerge.reduce((sum, t) => sum + t.x, 0) / tablesToMerge.length;
      const avgY = tablesToMerge.reduce((sum, t) => sum + t.y, 0) / tablesToMerge.length;
      
      let newStatus = 'Available';
      if (tablesToMerge.some(t => t.status === 'Occupied')) {
        newStatus = 'Occupied';
      } else if (tablesToMerge.some(t => t.status === 'Reserved')) {
        newStatus = 'Reserved';
      }
      
      const allOrders = tablesToMerge.map(t => t.order).filter(Boolean).flat();
      const newOrder = allOrders.length > 0 ? allOrders : null;
      
      const mergedTable = {
        id: `T${Date.now()}`,
        name: newName,
        capacity: newCapacity,
        floorId: tablesToMerge[0].floorId,
        status: newStatus,
        x: avgX,
        y: avgY,
        rotation: 0,
        span: Math.max(...tablesToMerge.map(t => t.span || 1)) + (tablesToMerge.length > 2 ? 1 : 0),
        order: newOrder,
        originalTables: tablesToMerge // Keep reference to allow unmerging
      };
      
      return [...prev.filter(t => !tableIds.includes(t.id)), mergedTable];
    });
  };

  const unmergeTable = (tableId) => {
    setTables(prev => {
      const tableToUnmerge = prev.find(t => t.id === tableId);
      if (!tableToUnmerge || !tableToUnmerge.originalTables) return prev;

      // Restore original tables, keeping them Available for now
      // Or we can keep the order on one of them, but usually they just split and become available, 
      // or we just restore their old state (but their order might have been completed). 
      // Safest is to restore them as Available without orders, or keep current status if we wanted to be fancy.
      // Let's restore them as Available.
      const restoredTables = tableToUnmerge.originalTables.map(t => ({
        ...t,
        status: 'Available',
        order: null
      }));

      return [
        ...prev.filter(t => t.id !== tableId),
        ...restoredTables
      ];
    });
  };

  return (
    <TablesContext.Provider value={{ 
      floors, 
      tables, 
      updateTableStatus, 
      updateTablePosition, 
      updateTableRotation, 
      addTable,
      updateTableDetails,
      deleteTable,
      mergeTables,
      unmergeTable
    }}>
      {children}
    </TablesContext.Provider>
  );
}

export const useTables = () => useContext(TablesContext);
