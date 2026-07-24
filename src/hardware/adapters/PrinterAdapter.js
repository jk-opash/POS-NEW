import ESCPOSGenerator from "../escpos/ESCPOSGenerator";

export default class PrinterAdapter {
  constructor() {
    this.connected = false;
  }

  async connect() {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.connected = true;
    console.log("[PrinterAdapter] Mock printer connected.");
    return true;
  }

  async disconnect() {
    this.connected = false;
    console.log("[PrinterAdapter] Mock printer disconnected.");
    return true;
  }

  async print(receiptData) {
    if (!this.connected) return false;
    // Simulate print delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate ESC/POS Bytes
    const generator = new ESCPOSGenerator();
    generator.init();
    
    // Header
    generator.align(1).bold(1).size(2, 2).textLine("RECEIPT").bold(0).size(1, 1).feed();
    
    // Assuming receiptData has total, payments, change
    if (receiptData) {
      generator.align(0);
      generator.textLine(`Total: $${receiptData.total}`);
      receiptData.payments?.forEach(p => {
        generator.textLine(`Paid (${p.method}): $${p.amount}`);
      });
      generator.textLine(`Change Due: $${receiptData.change}`);
    }

    generator.feed(2);
    // Print a mock barcode if it's a sale
    if (receiptData?.type === "sale") {
      generator.align(1).barcode("1234567890").feed(2);
    }
    
    generator.cut(true); // Partial cut

    console.log("[PrinterAdapter] 🖨️  Mock Print Job Processed.");
    console.log("[PrinterAdapter] RAW ESC/POS Hex Output:");
    console.log(generator.toHexString());
    console.log("---------------------------------------");
    
    return true;
  }

  async openDrawer() {
    if (!this.connected) return false;
    // Simulate drawer kick delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const generator = new ESCPOSGenerator();
    generator.kickDrawer(2);

    console.log("[PrinterAdapter] 💸 Mock Cash Drawer Kicked Open!");
    console.log("[PrinterAdapter] RAW ESC/POS Hex Output:");
    console.log(generator.toHexString());
    return true;
  }
}
