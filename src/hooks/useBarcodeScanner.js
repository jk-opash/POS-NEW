import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { useHardware } from '@/context/HardwareContext';

/**
 * Hook to intercept HID Barcode Scanner input globally.
 * Uses HardwareContext for architecture compliance.
 */
export function useBarcodeScanner(onScan, enabled = true) {
  const { hardwareStatus, manager } = useHardware();
  const bufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);

  // Subscribe to HAL Scanner Adapter
  useEffect(() => {
    if (!manager || !enabled) return;
    const unsubscribe = manager.onBarcodeScanned((barcode) => {
      onScan(barcode);
    });
    return () => unsubscribe();
  }, [manager, onScan, enabled]);

  // Fallback for Web: Global Key Listener
  const handleKeyPress = useCallback(
    (event) => {
      if (!enabled) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;

      if (timeDiff > 100) {
        bufferRef.current = '';
      }

      lastKeyTimeRef.current = currentTime;

      if (event.key === 'Enter') {
        const barcode = bufferRef.current.trim();
        if (barcode.length > 3) { 
          // Trigger via manager so it follows the HAL flow
          manager?.simulateScan(barcode);
          event.preventDefault(); 
        }
        bufferRef.current = ''; 
        return;
      }

      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        bufferRef.current += event.key;
      }
    },
    [enabled, manager]
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [handleKeyPress]);

  return {
    isScannerConnected: hardwareStatus.scannerConnected,
    simulateScan: (barcode) => manager?.simulateScan(barcode),
  };
}
