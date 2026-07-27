import React, { createContext, useContext, useState } from 'react';

const DiscountContext = createContext();

export function useDiscount() {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
}

const DEFAULT_DISCOUNT_RULES = [
  { id: 'd1', name: 'Employee Discount', type: 'percentage', value: 10, active: true },
  { id: 'd2', name: 'Happy Hour', type: 'percentage', value: 15, active: true },
  { id: 'd3', name: 'VIP Customer', type: 'percentage', value: 20, active: false },
  { id: 'd4', name: 'Flat Off 50', type: 'fixed', value: 50, active: true },
];

export function DiscountProvider({ children }) {
  const [discountRules, setDiscountRules] = useState(DEFAULT_DISCOUNT_RULES);

  const addDiscountRule = (rule) => {
    setDiscountRules((prev) => [
      ...prev,
      { ...rule, id: `d${Date.now()}` }
    ]);
  };

  const updateDiscountRule = (id, updates) => {
    setDiscountRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  const deleteDiscountRule = (id) => {
    setDiscountRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  return (
    <DiscountContext.Provider
      value={{
        discountRules,
        addDiscountRule,
        updateDiscountRule,
        deleteDiscountRule,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
}
