import React, { createContext, useContext, useState } from 'react';

const OnlineIntegrationContext = createContext();

export function useOnlineIntegration() {
  const context = useContext(OnlineIntegrationContext);
  if (!context) {
    throw new Error('useOnlineIntegration must be used within a OnlineIntegrationProvider');
  }
  return context;
}

const DEFAULT_PLATFORMS = [
  {
    id: 'zomato',
    name: 'Zomato',
    isActive: true,
    storeId: 'ZMT-12345',
    apiKey: 'zmt_live_abc123',
    autoAccept: true,
    themeColor: '#E23744',
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    isActive: true,
    storeId: 'SWG-98765',
    apiKey: 'swg_live_def456',
    autoAccept: false,
    themeColor: '#FC8019',
  },
  {
    id: 'ubereats',
    name: 'Uber Eats',
    isActive: false,
    storeId: '',
    apiKey: '',
    autoAccept: false,
    themeColor: '#000000',
  },
  {
    id: 'foodpanda',
    name: 'FoodPanda',
    isActive: false,
    storeId: '',
    apiKey: '',
    autoAccept: false,
    themeColor: '#D70F64',
  },
];

export function OnlineIntegrationProvider({ children }) {
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);

  const updatePlatform = (id, updates) => {
    setPlatforms((prev) =>
      prev.map((platform) =>
        platform.id === id ? { ...platform, ...updates } : platform
      )
    );
  };

  return (
    <OnlineIntegrationContext.Provider
      value={{
        platforms,
        updatePlatform,
      }}
    >
      {children}
    </OnlineIntegrationContext.Provider>
  );
}
