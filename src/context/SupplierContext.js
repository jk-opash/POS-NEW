import React, { createContext, useContext, useState } from "react";

const SupplierContext = createContext(null);

const DUMMY_SUPPLIERS = [
  {
    id: "SUP-001",
    name: "Fresh Farms Corp",
    businessName: "Fresh Farms Agriculture",
    category: "Manufacturer",
    status: "Active",
    registrationDate: "2023-01-15",
    contact: {
      person: "John Doe",
      mobile: "+1 (555) 123-4567",
      email: "orders@freshfarms.com",
      website: "www.freshfarms.com",
    },
    address: {
      line1: "123 Farm Road",
      city: "Valley City",
      state: "CA",
      country: "USA",
      zip: "90210",
    },
    tax: {
      gst: "GST-123456789",
    },
    banking: {
      bankName: "AgriBank",
      accName: "Fresh Farms Corp",
      accNo: "1234567890",
      ifsc: "AGRI0001",
    },
    performance: {
      deliveryScore: 4.8,
      qualityScore: 4.9,
      pricingScore: 4.5,
      overallRating: 4.7,
      riskLevel: "Low", // Low, Medium, High
    },
    stats: {
      totalOrders: 145,
      totalSpend: 54200.50,
      outstandingBalance: 1200.00,
      lastOrderDate: "2026-06-25",
      avgDeliveryTime: "2 Days",
      returnRate: "1.2%",
    },
    products: ["Tomatoes", "Lettuce", "Onions", "Potatoes"],
    contracts: {
      contractNumber: "CTR-2023-01",
      startDate: "2023-01-15",
      endDate: "2027-01-15",
      paymentTerms: "Net 30",
    },
    communications: [
      { id: 1, type: "Email", date: "2026-06-25", summary: "Sent PO for July produce." },
      { id: 2, type: "Call", date: "2026-06-10", summary: "Discussed price increase for tomatoes." },
    ]
  },
  {
    id: "SUP-002",
    name: "Global Beverages",
    businessName: "Global Beverage Dist LLC",
    category: "Distributor",
    status: "Active",
    registrationDate: "2024-03-22",
    contact: {
      person: "Jane Smith",
      mobile: "+1 (555) 987-6543",
      email: "sales@globalbevs.com",
      website: "www.globalbevs.com",
    },
    address: {
      line1: "45 Industrial Pkwy",
      city: "Metro City",
      state: "NY",
      country: "USA",
      zip: "10001",
    },
    tax: {
      gst: "GST-987654321",
    },
    banking: {
      bankName: "CityBank",
      accName: "Global Bev Dist",
      accNo: "0987654321",
      ifsc: "CITY0002",
    },
    performance: {
      deliveryScore: 3.5,
      qualityScore: 4.8,
      pricingScore: 3.2,
      overallRating: 3.8,
      riskLevel: "Medium",
    },
    stats: {
      totalOrders: 82,
      totalSpend: 128500.00,
      outstandingBalance: 4500.00,
      lastOrderDate: "2026-06-28",
      avgDeliveryTime: "5 Days",
      returnRate: "0.5%",
    },
    products: ["Cola", "Sparkling Water", "Energy Drinks"],
    contracts: {
      contractNumber: "CTR-2024-42",
      startDate: "2024-03-22",
      endDate: "2026-12-31",
      paymentTerms: "Net 15",
    },
    communications: [
      { id: 1, type: "Meeting", date: "2026-05-15", summary: "Quarterly review and Q3 volume discounts." }
    ]
  },
  {
    id: "SUP-003",
    name: "Prime Meats Co",
    businessName: "Prime Meats Wholesale",
    category: "Wholesaler",
    status: "Blocked",
    registrationDate: "2022-11-10",
    contact: {
      person: "Bob Barker",
      mobile: "+1 (555) 555-1212",
      email: "support@primemeats.com",
      website: "www.primemeats.com",
    },
    address: {
      line1: "99 Butcher Lane",
      city: "Chicago",
      state: "IL",
      country: "USA",
      zip: "60601",
    },
    tax: {
      gst: "GST-112233445",
    },
    banking: {
      bankName: "MeatBank",
      accName: "Prime Meats",
      accNo: "1122334455",
      ifsc: "MEAT0003",
    },
    performance: {
      deliveryScore: 2.1,
      qualityScore: 3.0,
      pricingScore: 4.0,
      overallRating: 2.8,
      riskLevel: "High",
    },
    stats: {
      totalOrders: 41,
      totalSpend: 89000.00,
      outstandingBalance: 0,
      lastOrderDate: "2026-01-10",
      avgDeliveryTime: "12 Days",
      returnRate: "8.5%",
    },
    products: ["Beef", "Chicken", "Pork"],
    contracts: {
      contractNumber: "CTR-2022-88",
      startDate: "2022-11-10",
      endDate: "2025-11-10",
      paymentTerms: "Immediate",
    },
    communications: [
      { id: 1, type: "Email", date: "2026-01-15", summary: "Notified of account block due to repeated delayed deliveries." }
    ]
  },
];

export function SupplierProvider({ children }) {
  const [suppliers, setSuppliers] = useState(DUMMY_SUPPLIERS);

  const addSupplier = (supplier) => {
    setSuppliers(prev => [...prev, { ...supplier, id: `SUP-${String(prev.length + 1).padStart(3, '0')}` }]);
  };

  const updateSupplier = (id, updates) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSupplier = (id) => {
    // We archive instead of hard delete per PRD Rule 5 & 6
    updateSupplier(id, { status: "Archived" });
  };

  const getSupplierStats = () => {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'Active').length;
    const outstanding = suppliers.reduce((sum, s) => sum + (s.stats?.outstandingBalance || 0), 0);
    return { total, active, outstanding };
  };

  const recordPayment = (supplierId, amount, method, reference) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id !== supplierId) return s;
      const parsedAmount = parseFloat(amount) || 0;
      const currentOutstanding = s.stats?.outstandingBalance || 0;
      return {
        ...s,
        stats: {
          ...s.stats,
          outstandingBalance: Math.max(0, currentOutstanding - parsedAmount)
        },
        communications: [
          {
            id: Date.now(),
            type: "Payment",
            date: new Date().toISOString().split('T')[0],
            summary: `Paid ₹${parsedAmount.toLocaleString()} via ${method} (Ref: ${reference || 'N/A'})`
          },
          ...(s.communications || [])
        ]
      };
    }));
  };

  const createPurchaseOrder = (supplierId, poData) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id !== supplierId) return s;
      const orderTotal = 0; // In a real app we'd calculate from items
      return {
        ...s,
        stats: {
          ...s.stats,
          totalOrders: (s.stats?.totalOrders || 0) + 1,
          lastOrderDate: new Date().toISOString().split('T')[0],
          // outstandingBalance might increase here, but let's just log it
        },
        communications: [
          {
            id: Date.now(),
            type: "PO Created",
            date: new Date().toISOString().split('T')[0],
            summary: `PO generated for Expected Delivery: ${poData.expectedDate}. Notes: ${poData.notes}`
          },
          ...(s.communications || [])
        ]
      };
    }));
  };

  const logCommunication = (supplierId, comm) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id !== supplierId) return s;
      return {
        ...s,
        communications: [
          {
            id: Date.now(),
            type: comm.type,
            date: comm.date,
            summary: comm.summary
          },
          ...(s.communications || [])
        ]
      };
    }));
  };

  const mapProduct = (supplierId, product) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id !== supplierId) return s;
      return {
        ...s,
        products: [...(s.products || []), product.name]
      };
    }));
  };

  return (
    <SupplierContext.Provider value={{
      suppliers,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      getSupplierStats,
      recordPayment,
      createPurchaseOrder,
      logCommunication,
      mapProduct
    }}>
      {children}
    </SupplierContext.Provider>
  );
}

export function useSuppliers() {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error("useSuppliers must be used within a SupplierProvider");
  }
  return context;
}
