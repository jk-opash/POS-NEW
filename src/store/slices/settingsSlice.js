import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_SETTINGS = {
  business: {
    name: 'Spice Garden Restaurant', type: 'Restaurant / QSR', vertical: 'FNB',
    verticalFlags: { isRetail: false, isFNB: true, isServices: false },
    regNumber: 'U55101GJ2023PTC123456', gstNumber: '24AABCU9603R1ZM', fssaiLicense: '10023456789012',
    email: 'info@spicegarden.in', phone: '+91 79 2345 6789', website: 'www.spicegarden.in',
    address: '12, CG Road, Navrangpura', country: 'India', state: 'Gujarat', city: 'Ahmedabad',
    postalCode: '380009', timeZone: 'Asia/Kolkata', logoUrl: '', facebook: '@spicegarden', instagram: '@spicegarden_ahmedabad',
  },
  branch: {
    code: 'BR-001', manager: 'Rajesh Patel', status: 'Active', contactEmail: 'cg-road@spicegarden.in',
    contactPhone: '+91 79 2345 6789', openingHours: '11:00 AM - 11:00 PM', capacity: 80, features: ['AC Dining', 'Private Room', 'Rooftop'],
  },
  tax: { defaultRate: 5, inclusive: false, compound: false, taxId: 'GST-001', exemptionsEnabled: true, gstEnabled: true },
  gst: {
    cgstRate: 2.5, sgstRate: 2.5, igstRate: 5, cessRate: 0, isInterState: false, hsnCodeDefault: '996331',
    enableEInvoice: false, gstinNumber: '24AABCU9603R1ZM', stateCode: '24', placeOfSupply: 'Gujarat', reverseCharge: false, compositionScheme: false,
  },
  currency: { symbol: '₹', code: 'INR', dateFormat: 'DD/MM/YYYY', timeFormat: '12h', decimalPlaces: 2, thousandSeparator: ',', currencyPosition: 'left' },
  receipt: {
    header: 'Welcome to Spice Garden!', footer: 'Thank you for dining with us. Visit again!', showTax: true, showGSTBreakdown: true,
    showCustomer: true, printLogo: true, barcodeEnabled: true, qrCodeUrl: 'https://spicegarden.in/feedback', showCashierName: true,
    showFSSAI: true, showGSTIN: true, paperWidth: '80mm', autoPrint: true,
  },
  invoice: { prefix: 'INV-', dueDays: 14, notes: 'GST compliant invoice. Thank you!', bankDetails: 'Bank: HDFC, A/C: 00123456789, IFSC: HDFC0001234', showHSNCode: true, showSAC: true },
  payment: {
    cashEnabled: true, cardEnabled: true, upiEnabled: true, walletEnabled: true, splitPaymentEnabled: true,
    surchargePercentage: 0, roundingEnabled: true, roundingTo: 1, defaultMethod: 'Cash', tipEnabled: true, defaultTipPercentages: [5, 10, 15],
  },
  discount: { maxPercentage: 20, managerApprovalRequired: true, allowStacking: false, loyaltyDiscount: 5, happyHourEnabled: true, happyHourStart: '15:00', happyHourEnd: '18:00', happyHourDiscount: 15, promoCodesEnabled: true, buyXGetYEnabled: true, comboDealsEnabled: true },
  inventory: { allowNegative: false, lowStockThreshold: 10, autoPurchaseOrders: false, defaultSupplier: 'Metro Cash & Carry', trackWaste: true, barcodeFormat: 'EAN-13', autoDeductOnSale: true, expiryTrackingEnabled: true },
  product: { skuAutoGenerate: true },
  customer: { requireRegistration: false, defaultGroup: 'Regular', enableLoyalty: true, marketingOptInDefault: false, allowStoreCredit: true },
  loyalty: { pointsPerHundredRupees: 10, minRedemption: 100, pointValue: 0.25, expiryDays: 365, welcomeBonus: 50, birthdayBonus: 100 },
  employee: { sessionTimeout: 60, requirePinForVoid: true, requirePinForDiscount: true, trackOvertime: false, biometricLogin: false, allowClockInOut: true, maxDiscountWithoutApproval: 10 },
  restaurant: { serviceCharge: 5, serviceChargeEnabled: false, diningModes: ['Dine In', 'Takeaway', 'Delivery', 'Online'], enableTableManagement: true, routeToKDS: true, defaultTipPercentage: 10, coverChargeEnabled: false, coverCharge: 0, autoAcceptOnlineOrders: false, onlineOrderTimer: 120 },
  kot: { autoNumber: true, numberPrefix: 'KOT', resetDaily: true, autoPrint: true, stationWisePrinting: true, showItemNotes: true, showModifiers: true, showTable: true, showWaiter: true, beepOnNew: true, printOnModify: true, cancelRequiresReason: true },
  onlineOrdering: { swiggyEnabled: true, zomatoEnabled: true, directOrderEnabled: true, whatsappOrderEnabled: false, autoAccept: false, acceptTimerSeconds: 120, menuSyncEnabled: true, commissionTracking: true, deliveryRadiusKm: 10, minOrderAmount: 200, packagingCharge: 20 },
  qrOrdering: { enabled: true, menuStyle: 'grid', allowPayment: false, showImages: true, showDescription: true, showVegFilter: true, requireTableScan: true, autoRouteToKDS: true },
  dayEnd: { autoPromptClose: true, promptTime: '23:00', requireCashCount: true, requireManagerApproval: false, autoEmailReport: true, reportRecipients: ['manager@spicegarden.in'], printSummary: true },
  feedback: { enabled: true, ratingScale: 5, showOnReceipt: true, smsEnabled: false, whatsappEnabled: true, autoPromptAfterBill: true, feedbackQuestions: ['Food Quality', 'Service', 'Ambience', 'Value for Money'] },
  crm: { autoCapture: true, birthdayReminder: true, inactiveCustomerDays: 30, smsProvider: 'MSG91', whatsappProvider: 'Interakt', campaignEnabled: true },
  notification: { emailAlerts: true, lowStockAlerts: true, newOnlineOrderSound: true, feedbackAlerts: true, dayEndReminder: true, staffClockInAlert: false },
  hardware: { defaultPrinter: 'Epson TM-T82II', kitchenPrinter: 'Epson TM-U220', cashDrawerEnabled: true, customerDisplayEnabled: false, barcodeScannerEnabled: true, weighingScalePort: '', kotPrinterStations: { 'Main Kitchen': 'Kitchen Printer 1', 'Tandoor': 'Kitchen Printer 2', 'Bar': 'Bar Printer', 'Desserts': 'Kitchen Printer 1' } },
  integration: { paymentProvider: 'Razorpay', accountingSync: 'Tally Prime', deliveryPartners: ['Swiggy', 'Zomato', 'Dunzo'], smsProvider: 'MSG91', emailProvider: 'SendGrid', whatsappProvider: 'Interakt' },
  backup: { autoBackup: true, backupFrequency: 'Daily', retentionDays: 30, cloudProvider: 'AWS S3' },
  security: { twoFactor: false, passwordExpiryDays: 90, maxLoginAttempts: 5, ipWhitelisting: false },
  subscription: { plan: 'Pro', billingCycle: 'Annual', nextBillingDate: '2027-01-01', paymentMethod: 'UPI Auto-debit' },
  system: { theme: 'Light', language: 'English', autoLogout: 15, enableAnalytics: true, debugMode: false },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { settings: DEFAULT_SETTINGS },
  reducers: {
    updateSetting: (state, action) => {
      const { category, key, value } = action.payload;
      if (!state.settings[category]) state.settings[category] = {};
      state.settings[category][key] = value;
    },
    updateNestedSetting: (state, action) => {
      const { category, subCategory, key, value } = action.payload;
      if (!state.settings[category]) state.settings[category] = {};
      if (!state.settings[category][subCategory]) state.settings[category][subCategory] = {};
      state.settings[category][subCategory][key] = value;
    }
  }
});

export const { updateSetting, updateNestedSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
