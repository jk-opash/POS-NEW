/**
 * ESC/POS Generator
 * A mock engine for generating raw ESC/POS byte commands for thermal receipt printers.
 * In a real hardware integration, these buffers would be written directly to a
 * Bluetooth serial port or a TCP socket.
 */

class ESCPOSGenerator {
  constructor() {
    this.buffer = [];
  }

  // --- Core Commands ---

  /** Initialize printer */
  init() {
    this.buffer.push(0x1b, 0x40); // ESC @
    return this;
  }

  /** Print and feed n lines */
  feed(lines = 1) {
    this.buffer.push(0x1b, 0x64, lines); // ESC d n
    return this;
  }

  /** Cut paper */
  cut(partial = false) {
    this.buffer.push(0x1d, 0x56, partial ? 0x01 : 0x00); // GS V
    return this;
  }

  /** Kick Cash Drawer (Pin 2 or Pin 5) */
  kickDrawer(pin = 2) {
    if (pin === 2) {
      this.buffer.push(0x1b, 0x70, 0x00, 0x19, 0xfa); // ESC p 0 25 250
    } else {
      this.buffer.push(0x1b, 0x70, 0x01, 0x19, 0xfa); // ESC p 1 25 250
    }
    return this;
  }

  // --- Text Formatting ---

  /** Set text alignment (0: left, 1: center, 2: right) */
  align(align = 0) {
    this.buffer.push(0x1b, 0x61, align); // ESC a n
    return this;
  }

  /** Set bold (1: on, 0: off) */
  bold(on = 1) {
    this.buffer.push(0x1b, 0x45, on); // ESC E n
    return this;
  }

  /** Set text size (1-8 for width/height) */
  size(width = 1, height = 1) {
    const w = (width - 1) << 4;
    const h = height - 1;
    this.buffer.push(0x1d, 0x21, w | h); // GS ! n
    return this;
  }

  // --- Content ---

  /** Write raw text string */
  text(str) {
    for (let i = 0; i < str.length; i++) {
      this.buffer.push(str.charCodeAt(i));
    }
    return this;
  }

  /** Write text and newline */
  textLine(str = "") {
    this.text(str);
    this.buffer.push(0x0a); // LF
    return this;
  }

  /** Draw a divider line */
  divider(char = "-", width = 48) {
    this.textLine(char.repeat(width));
    return this;
  }

  // --- Barcode / QR ---

  /** Print a CODE39 barcode */
  barcode(data) {
    // Set height (e.g. 50 dots)
    this.buffer.push(0x1d, 0x68, 50); // GS h 50
    // Set width (2-6)
    this.buffer.push(0x1d, 0x77, 2); // GS w 2
    // Set HRI characters below barcode
    this.buffer.push(0x1d, 0x48, 2); // GS H 2
    // Print barcode (System A, Code 39 = 4)
    this.buffer.push(0x1d, 0x6b, 4); // GS k 4
    this.text(data);
    this.buffer.push(0x00); // NUL terminator
    return this;
  }

  // --- Output ---

  /** Get the final Uint8Array payload */
  build() {
    return new Uint8Array(this.buffer);
  }

  /** Helper to visualize the buffer as a hex string for debugging */
  toHexString() {
    return this.buffer.map(b => "0x" + b.toString(16).padStart(2, '0')).join(" ");
  }
}

export default ESCPOSGenerator;
