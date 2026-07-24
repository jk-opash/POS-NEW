import React, { createContext, useContext, useState } from 'react';

const ShiftContext = createContext();

export function ShiftProvider({ children }) {
  const [activeShift, setActiveShift] = useState(null);
  
  // Historical shifts can be saved here
  const [shiftHistory, setShiftHistory] = useState([]);

  const openShift = (startingCash, employee) => {
    setActiveShift({
      id: `SHIFT-${Date.now()}`,
      employee: employee?.firstName || 'Staff',
      openedAt: new Date().toISOString(),
      startingCash: startingCash,
      expectedCash: startingCash,
      cashSales: 0,
      cashRefunds: 0,
      payInsOuts: 0,
    });
  };

  const closeShift = (actualCash, notes = "") => {
    if (!activeShift) return;
    
    const closedShift = {
      ...activeShift,
      closedAt: new Date().toISOString(),
      actualCash,
      discrepancy: actualCash - activeShift.expectedCash,
      notes
    };
    
    setShiftHistory(prev => [...prev, closedShift]);
    setActiveShift(null);
  };

  const addCashTransaction = (amount, type = 'sale') => {
    if (!activeShift) return;

    setActiveShift(prev => {
      let newExpected = prev.expectedCash;
      let newSales = prev.cashSales;
      let newRefunds = prev.cashRefunds;

      if (type === 'sale') {
        newExpected += amount;
        newSales += amount;
      } else if (type === 'refund') {
        newExpected -= amount;
        newRefunds += amount;
      }

      return {
        ...prev,
        expectedCash: newExpected,
        cashSales: newSales,
        cashRefunds: newRefunds,
      };
    });
  };

  return (
    <ShiftContext.Provider
      value={{
        activeShift,
        shiftHistory,
        openShift,
        closeShift,
        addCashTransaction
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
}

export const useShift = () => useContext(ShiftContext);
