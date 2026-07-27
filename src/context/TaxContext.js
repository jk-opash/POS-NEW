import React, { createContext, useContext, useState } from 'react';

const TaxContext = createContext();

export function useTax() {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
}

const DEFAULT_TAX_RULES = [
  { id: 't1', name: 'CGST', rate: 2.5, type: 'percentage', active: true },
  { id: 't2', name: 'SGST', rate: 2.5, type: 'percentage', active: true },
  { id: 't3', name: 'Service Charge', rate: 5.0, type: 'percentage', active: false },
];

const DEFAULT_SETTINGS = {
  inclusive: false,
  compound: false,
  exemptionsEnabled: true,
  taxId: '24AABCU9603R1ZM'
};

export function TaxProvider({ children }) {
  const [taxRules, setTaxRules] = useState(DEFAULT_TAX_RULES);
  const [taxSettings, setTaxSettings] = useState(DEFAULT_SETTINGS);

  const addTaxRule = (rule) => {
    setTaxRules((prev) => [
      ...prev,
      { ...rule, id: `t${Date.now()}` }
    ]);
  };

  const updateTaxRule = (id, updates) => {
    setTaxRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  const deleteTaxRule = (id) => {
    setTaxRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const updateTaxSetting = (key, value) => {
    setTaxSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <TaxContext.Provider
      value={{
        taxRules,
        taxSettings,
        addTaxRule,
        updateTaxRule,
        deleteTaxRule,
        updateTaxSetting,
      }}
    >
      {children}
    </TaxContext.Provider>
  );
}
