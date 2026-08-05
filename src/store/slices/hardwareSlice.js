import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_PRINTER_CONFIG = {
  paperSize: '80mm', 
  headerText: 'MY AWESOME CAFE\n123 Coffee Street, Bean City\nGST: 22AAAAA0000A1Z5',
  footerText: 'Thank you for your visit!\nPlease come again.',
  printKot: true,
  kotRouting: false,
};

const initialState = {
  printerConfig: DEFAULT_PRINTER_CONFIG,
  hardwareStatus: {
    printer: 'Disconnected',
    barcodeScanner: 'Disconnected',
    cashDrawer: 'Disconnected',
    paymentTerminal: 'Disconnected',
  }
};

const hardwareSlice = createSlice({
  name: 'hardware',
  initialState,
  reducers: {
    updatePrinterConfig: (state, action) => {
      const { key, value } = action.payload;
      state.printerConfig[key] = value;
    },
    setHardwareStatus: (state, action) => {
      state.hardwareStatus = action.payload;
    }
  }
});

export const { updatePrinterConfig, setHardwareStatus } = hardwareSlice.actions;
export default hardwareSlice.reducer;
