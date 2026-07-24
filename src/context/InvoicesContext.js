import React, { createContext, useContext, useState } from "react";

const InvoicesContext = createContext();

export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoicesProvider");
  }
  return context;
}

const mockInvoices = [
  {
    id: "INV-2026-000101",
    type: "Sales Invoice",
    date: "2026-06-30T10:15:00Z",
    customer: {
      name: "John Doe",
      phone: "+1 234 567 8900",
      email: "john@example.com",
    },
    store: "Downtown Branch",
    cashier: "Alice Smith",
    paymentMethod: "Credit Card",
    status: "Paid",
    subtotal: 120.0,
    discount: 10.0,
    tax: 8.8,
    grandTotal: 118.8,
    amountPaid: 118.8,
    outstandingBalance: 0,
    items: [
      {
        name: "Wireless Mouse",
        sku: "WM-01",
        qty: 2,
        unitPrice: 40.0,
        tax: 6.4,
        total: 86.4,
      },
      {
        name: "Mouse Pad",
        sku: "MP-05",
        qty: 2,
        unitPrice: 20.0,
        tax: 2.4,
        total: 42.4,
      },
    ],
    notes: "Thank you for your business!",
  },
  {
    id: "INV-2026-000102",
    type: "Tax Invoice",
    date: "2026-06-29T14:30:00Z",
    customer: {
      name: "Acme Corp",
      phone: "+1 987 654 3210",
      email: "billing@acmecorp.com",
    },
    store: "Uptown Branch",
    cashier: "Bob Jones",
    paymentMethod: "Bank Transfer",
    status: "Pending Payment",
    subtotal: 500.0,
    discount: 50.0,
    tax: 45.0,
    grandTotal: 495.0,
    amountPaid: 0,
    outstandingBalance: 495.0,
    items: [
      {
        name: "Office Chair",
        sku: "OC-12",
        qty: 2,
        unitPrice: 250.0,
        tax: 45.0,
        total: 545.0,
      },
    ],
    notes: "Please pay within 30 days.",
  },
  {
    id: "INV-2026-000103",
    type: "Proforma Invoice",
    date: "2026-06-28T09:00:00Z",
    customer: {
      name: "Sarah Williams",
      phone: "+1 555 123 4567",
      email: "sarah.w@example.com",
    },
    store: "Downtown Branch",
    cashier: "Alice Smith",
    paymentMethod: "-",
    status: "Draft",
    subtotal: 150.0,
    discount: 0,
    tax: 15.0,
    grandTotal: 165.0,
    amountPaid: 0,
    outstandingBalance: 165.0,
    items: [
      {
        name: "Mechanical Keyboard",
        sku: "MK-99",
        qty: 1,
        unitPrice: 150.0,
        tax: 15.0,
        total: 165.0,
      },
    ],
    notes: "Quotation valid for 15 days.",
  },
  {
    id: "INV-2026-000104",
    type: "Refund Invoice",
    date: "2026-06-27T16:45:00Z",
    customer: {
      name: "Mike Johnson",
      phone: "+1 555 987 6543",
      email: "mike.j@example.com",
    },
    store: "Westside Branch",
    cashier: "Charlie Brown",
    paymentMethod: "Cash",
    status: "Refunded",
    subtotal: -45.0,
    discount: 0,
    tax: -3.6,
    grandTotal: -48.6,
    amountPaid: -48.6,
    outstandingBalance: 0,
    items: [
      {
        name: "USB-C Hub",
        sku: "UH-02",
        qty: 1,
        unitPrice: -45.0,
        tax: -3.6,
        total: -48.6,
      },
    ],
    notes: "Customer returned defective item.",
  },
  {
    id: "INV-2026-000105",
    type: "Sales Invoice",
    date: "2026-05-15T11:20:00Z",
    customer: {
      name: "Emma Davis",
      phone: "+1 444 555 6666",
      email: "emma.d@example.com",
    },
    store: "Downtown Branch",
    cashier: "Alice Smith",
    paymentMethod: "Credit Card",
    status: "Overdue",
    subtotal: 300.0,
    discount: 0,
    tax: 30.0,
    grandTotal: 330.0,
    amountPaid: 150.0,
    outstandingBalance: 180.0,
    items: [
      {
        name: "24-inch Monitor",
        sku: "MN-24",
        qty: 1,
        unitPrice: 300.0,
        tax: 30.0,
        total: 330.0,
      },
    ],
    notes: "Partial payment received. Please clear the balance.",
  },
];

const generateDummyInvoices = (count) => {
  const types = [
    "Sales Invoice",
    "Tax Invoice",
    "Proforma Invoice",
    "Refund Invoice",
  ];
  const statuses = ["Paid", "Pending"];
  const names = [
    "John Doe",
    "Acme Corp",
    "Sarah Williams",
    "Mike Johnson",
    "Emma Davis",
    "XYZ Limited",
    "Tech Solutions",
    "Jane Smith",
    "Bob Builders",
    "Alpha Group",
    "Beta Inc",
  ];
  const generated = [];

  for (let i = 6; i <= count + 5; i++) {
    const id = `INV-2026-${i.toString().padStart(6, "0")}`;
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = parseFloat((Math.random() * 1000 + 50).toFixed(2));

    const date = new Date();
    // 20% chance to be today, otherwise random in last 180 days
    if (Math.random() > 0.2) {
      const daysAgo = Math.floor(Math.random() * 180) + 1;
      date.setDate(date.getDate() - daysAgo);
    }

    // random hours
    date.setHours(Math.floor(Math.random() * 12) + 8);
    date.setMinutes(Math.floor(Math.random() * 60));

    generated.push({
      id,
      type,
      date: date.toISOString(),
      table:
        Math.random() > 0.5
          ? `Table ${Math.floor(Math.random() * 25) + 1}`
          : null,
      customer: {
        name: names[Math.floor(Math.random() * names.length)],
        phone: "+1 000 000 0000",
        email: "auto@example.com",
      },
      store: "Downtown Branch",
      cashier: "Auto Gen",
      paymentMethod: "Credit Card",
      status,
      subtotal: amount,
      discount: 0,
      tax: amount * 0.1,
      grandTotal: amount * 1.1,
      amountPaid: status === "Paid" ? amount * 1.1 : 0,
      outstandingBalance: status === "Paid" ? 0 : amount * 1.1,
      items: [
        {
          name: "Generated Item",
          sku: "GEN-01",
          qty: 1,
          unitPrice: amount,
          tax: amount * 0.1,
          total: amount * 1.1,
        },
      ],
      notes: "Auto-generated invoice.",
    });
  }

  // Sort descending by date
  return generated.sort((a, b) => new Date(b.date) - new Date(a.date));
};

mockInvoices.push(...generateDummyInvoices(45));

export function InvoicesProvider({ children }) {
  const [invoices, setInvoices] = useState(mockInvoices);

  // Sync state during hot reloads
  React.useEffect(() => {
    if (invoices.length < mockInvoices.length) {
      setInvoices([...mockInvoices]);
    }
  }, [mockInvoices.length]);

  const addInvoice = (invoiceData) => {
    const newId = `INV-2026-000${100 + invoices.length + 1}`;
    const newInvoice = {
      id: newId,
      date: new Date().toISOString(),
      ...invoiceData,
    };
    setInvoices([newInvoice, ...invoices]);
  };

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id ? { ...inv, status: newStatus } : inv,
      ),
    );
  };

  // KPI Calculations
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalInvoices = invoices.length;
  const averageValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoiceStatus,
        metrics: {
          totalInvoices,
          totalRevenue,
          averageValue,
        },
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
}
