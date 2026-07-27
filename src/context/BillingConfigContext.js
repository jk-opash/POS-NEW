import React, { createContext, useContext, useState } from 'react';

const BillingConfigContext = createContext();

export function useBillingConfig() {
  const context = useContext(BillingConfigContext);
  if (!context) {
    throw new Error('useBillingConfig must be used within a BillingConfigProvider');
  }
  return context;
}

const DEFAULT_BILLING_CONFIG = {
  showItemImages: true,
  defaultCategoryView: 'grid', // 'grid' | 'list'
  autoPrintBill: false,
  quickCashButtons: true,
  requirePasscodeForVoid: true,
};

export function BillingConfigProvider({ children }) {
  const [billingConfig, setBillingConfig] = useState(DEFAULT_BILLING_CONFIG);

  const updateConfig = (key, value) => {
    setBillingConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <BillingConfigContext.Provider
      value={{
        config: billingConfig,
        updateConfig,
      }}
    >
      {children}
    </BillingConfigContext.Provider>
  );
}
