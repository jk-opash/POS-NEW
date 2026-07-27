import React, { createContext, useContext, useState } from 'react';

const PrinterConfigContext = createContext();

export function usePrinterConfig() {
  const context = useContext(PrinterConfigContext);
  if (!context) {
    throw new Error('usePrinterConfig must be used within a PrinterConfigProvider');
  }
  return context;
}

const DEFAULT_PRINTER_CONFIG = {
  paperSize: '80mm', // '58mm' | '80mm'
  headerText: 'MY AWESOME CAFE\n123 Coffee Street, Bean City\nGST: 22AAAAA0000A1Z5',
  footerText: 'Thank you for your visit!\nPlease come again.',
  printKot: true,
  kotRouting: false, // Category-based routing (e.g., drinks to bar printer)
};

export function PrinterConfigProvider({ children }) {
  const [printerConfig, setPrinterConfig] = useState(DEFAULT_PRINTER_CONFIG);

  const updateConfig = (key, value) => {
    setPrinterConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <PrinterConfigContext.Provider
      value={{
        config: printerConfig,
        updateConfig,
      }}
    >
      {children}
    </PrinterConfigContext.Provider>
  );
}
