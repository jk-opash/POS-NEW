export default class ScannerAdapter {
  constructor() {
    this.connected = false;
    this.listeners = new Set();
  }

  async connect() {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.connected = true;
    console.log("[ScannerAdapter] Mock barcode scanner connected.");
    return true;
  }

  async disconnect() {
    this.connected = false;
    console.log("[ScannerAdapter] Mock barcode scanner disconnected.");
    return true;
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  // Method to manually trigger a scan for testing purposes
  simulateScan(barcodeData) {
    if (!this.connected) return;
    console.log(`[ScannerAdapter] 📟 Mock Scan Detected: ${barcodeData}`);
    this.listeners.forEach((callback) => callback(barcodeData));
  }
}
