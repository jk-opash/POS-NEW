import React, { createContext, useContext, useEffect, useState } from "react";
import hardwareManager from "@/hardware/HardwareManager";

const HardwareContext = createContext();

export function useHardware() {
  const context = useContext(HardwareContext);
  if (!context) {
    throw new Error("useHardware must be used within a HardwareProvider");
  }
  return context;
}

export function HardwareProvider({ children }) {
  const [hardwareStatus, setHardwareStatus] = useState(hardwareManager.status);

  useEffect(() => {
    // Subscribe to hardware manager state changes
    const unsubscribe = hardwareManager.subscribe((status) => {
      setHardwareStatus({ ...status });
    });

    // Auto-connect mocks on startup
    hardwareManager.connectAll();

    return () => {
      unsubscribe();
      hardwareManager.disconnectAll();
    };
  }, []);

  const printReceipt = async (receiptData) => {
    return await hardwareManager.printReceipt(receiptData);
  };

  const openCashDrawer = async () => {
    return await hardwareManager.openCashDrawer();
  };

  const simulateBarcodeScan = (barcode) => {
    hardwareManager.simulateScan(barcode);
  };

  return (
    <HardwareContext.Provider
      value={{
        hardwareStatus,
        printReceipt,
        openCashDrawer,
        simulateBarcodeScan,
        // Optional: raw manager access if needed
        manager: hardwareManager,
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
}
