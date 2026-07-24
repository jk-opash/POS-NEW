import React, { createContext, useContext, useState } from "react";

const BranchesContext = createContext();

export function BranchesProvider({ children }) {
  const [activeBranch, setActiveBranch] = useState("br-1");
  const [branches, setBranches] = useState([
    {
      id: "br-1",
      name: "CG Road - Navrangpura",
      code: "SGR-01",
      type: "Restaurant",
      company: "Spice Garden Restaurants Pvt Ltd",
      region: "West India",
      contact: "+91 79 2345 6789",
      email: "cg-road@spicegarden.in",
      address: "12, CG Road, Navrangpura",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      currency: "INR",
      timeZone: "Asia/Kolkata",
      taxJurisdiction: "GST - Gujarat",
      storeSize: "3000 sqft",
      openingDate: "2021-03-15",
      taxRegistration: "24AABCU9603R1ZM",
      status: "Operational",
      manager: "Rajesh Patel",
      capacity: 80,
      tables: 20,
      schedule: {
        weekday: "11:00 AM - 11:00 PM",
        weekend: "11:00 AM - 11:30 PM",
      },
      metrics: {
        todaySales: 42800,
        ordersProcessed: 67,
        revenue: 1280000,
        profit: 512000,
        inventoryValue: 180000,
        employeeCount: 18,
        customerCount: 4200,
        averageCheckoutTime: "3m 30s",
        conversionRate: "N/A",
        shrinkage: "1.2%",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "br-2",
      name: "SG Highway - Bodakdev",
      code: "SGR-02",
      type: "Restaurant + Banquet",
      company: "Spice Garden Restaurants Pvt Ltd",
      region: "West India",
      contact: "+91 79 2345 6790",
      email: "sg-highway@spicegarden.in",
      address: "A-5, SG Business Hub, SG Highway",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      currency: "INR",
      timeZone: "Asia/Kolkata",
      taxJurisdiction: "GST - Gujarat",
      storeSize: "5500 sqft",
      openingDate: "2022-08-10",
      taxRegistration: "24AABCU9603R2ZM",
      status: "Operational",
      manager: "Meena Shah",
      capacity: 120,
      tables: 30,
      schedule: {
        weekday: "11:00 AM - 11:30 PM",
        weekend: "11:00 AM - 12:00 AM",
      },
      metrics: {
        todaySales: 58500,
        ordersProcessed: 92,
        revenue: 1750000,
        profit: 700000,
        inventoryValue: 250000,
        employeeCount: 25,
        customerCount: 6800,
        averageCheckoutTime: "4m 00s",
        conversionRate: "N/A",
        shrinkage: "0.9%",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "br-3",
      name: "Surat - Adajan",
      code: "SGR-03",
      type: "Restaurant",
      company: "Spice Garden Restaurants Pvt Ltd",
      region: "South Gujarat",
      contact: "+91 261 234 5678",
      email: "surat@spicegarden.in",
      address: "22, Ring Road, Adajan",
      city: "Surat",
      state: "Gujarat",
      country: "India",
      currency: "INR",
      timeZone: "Asia/Kolkata",
      taxJurisdiction: "GST - Gujarat",
      storeSize: "2800 sqft",
      openingDate: "2023-11-01",
      taxRegistration: "24AABCU9603R3ZM",
      status: "Operational",
      manager: "Vijay Singh",
      capacity: 60,
      tables: 15,
      schedule: {
        weekday: "11:00 AM - 10:30 PM",
        weekend: "11:00 AM - 11:00 PM",
      },
      metrics: {
        todaySales: 28500,
        ordersProcessed: 45,
        revenue: 850000,
        profit: 340000,
        inventoryValue: 140000,
        employeeCount: 12,
        customerCount: 2800,
        averageCheckoutTime: "3m 15s",
        conversionRate: "N/A",
        shrinkage: "1.5%",
      },
      createdAt: new Date().toISOString(),
    },
  ]);

  const addBranch = (branch) => {
    setBranches((prev) => [
      ...prev,
      {
        ...branch,
        id: `br-${Date.now()}`,
        metrics: {
          todaySales: 0,
          ordersProcessed: 0,
          revenue: 0,
          profit: 0,
          inventoryValue: 0,
          employeeCount: 0,
          customerCount: 0,
          averageCheckoutTime: "0s",
          conversionRate: "0%",
          shrinkage: "0%",
        },
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const updateBranch = (id, updates) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBranch = (id) => {
    // In a real app, you might just mark as 'Closed' instead of deleting.
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BranchesContext.Provider
      value={{ branches, addBranch, updateBranch, deleteBranch, activeBranch, setActiveBranch }}
    >
      {children}
    </BranchesContext.Provider>
  );
}

export function useBranches() {
  const context = useContext(BranchesContext);
  if (!context) {
    throw new Error("useBranches must be used within a BranchesProvider");
  }
  return context;
}
