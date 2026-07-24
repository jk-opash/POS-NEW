import PrinterAdapter from "./adapters/PrinterAdapter";
import ScannerAdapter from "./adapters/ScannerAdapter";

class HardwareManager {
  constructor() {
    this.printer = new PrinterAdapter();
    this.scanner = new ScannerAdapter();
    
    // Status object indicating whether mock devices are connected
    this.status = {
      printerConnected: false,
      scannerConnected: false,
      cashDrawerConnected: false, // typically chained to printer
    };

    // Subscriptions for state changes
    this.listeners = new Set();
  }

  // --- Connection Methods ---

  async connectAll() {
    console.log("[HAL] Connecting to hardware devices...");
    const pConnected = await this.printer.connect();
    const sConnected = await this.scanner.connect();

    this.status = {
      printerConnected: pConnected,
      scannerConnected: sConnected,
      cashDrawerConnected: pConnected, // Assuming chained
    };
    this.notifyListeners();
  }

  async disconnectAll() {
    await this.printer.disconnect();
    await this.scanner.disconnect();
    this.status = {
      printerConnected: false,
      scannerConnected: false,
      cashDrawerConnected: false,
    };
    this.notifyListeners();
  }

  // --- Printer / Cash Drawer Methods ---

  async printReceipt(receiptData) {
    if (!this.status.printerConnected) {
      console.warn("[HAL] Cannot print, printer disconnected.");
      return false;
    }
    return await this.printer.print(receiptData);
  }

  async openCashDrawer() {
    if (!this.status.cashDrawerConnected) {
      console.warn("[HAL] Cannot open cash drawer, disconnected.");
      return false;
    }
    return await this.printer.openDrawer();
  }

  // --- Scanner Methods ---

  onBarcodeScanned(callback) {
    this.scanner.addListener(callback);
    return () => this.scanner.removeListener(callback);
  }

  simulateScan(barcodeData) {
    if (this.status.scannerConnected) {
      this.scanner.simulateScan(barcodeData);
    }
  }

  // --- Listener Management ---

  subscribe(listener) {
    this.listeners.add(listener);
    // Send initial state immediately
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }
}

// Singleton instance
const hardwareManager = new HardwareManager();
export default hardwareManager;
