import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setHardwareStatus } from '../store/slices/hardwareSlice';
import hardwareManager from "@/hardware/HardwareManager";

export function useHardware() {
  const dispatch = useDispatch();
  const hardwareStatus = useSelector(state => state.hardware.hardwareStatus);

  const printReceipt = async (receiptData) => {
    return await hardwareManager.printReceipt(receiptData);
  };

  const openCashDrawer = async () => {
    return await hardwareManager.openCashDrawer();
  };

  const simulateBarcodeScan = (barcode) => {
    hardwareManager.simulateScan(barcode);
  };

  return {
    hardwareStatus,
    printReceipt,
    openCashDrawer,
    simulateBarcodeScan,
    manager: hardwareManager,
  };
}

export function HardwareSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = hardwareManager.subscribe((status) => {
      dispatch(setHardwareStatus({ ...status }));
    });

    hardwareManager.connectAll();

    return () => {
      unsubscribe();
      hardwareManager.disconnectAll();
    };
  }, [dispatch]);

  return null;
}
