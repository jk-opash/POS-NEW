import React, { createContext, useContext, useState } from "react";

const SupportContext = createContext();

export function SupportProvider({ children }) {
  const [faqs] = useState([
    { id: "faq-1", question: "How do I add a new product?", answer: "Go to the Products screen, click 'Add Product', and fill out the product details in the wizard." },
    { id: "faq-2", question: "How do I process a refund?", answer: "Navigate to the Orders screen, select the completed order, and click on 'Issue Refund'." },
    { id: "faq-3", question: "How do I transfer inventory?", answer: "Open the Inventory screen, switch to the Transfers tab, and click 'New Transfer'." },
    { id: "faq-4", question: "How do loyalty points work?", answer: "Customers earn 1 point for every ₹100 spent. Points can be redeemed at checkout (10 points = ₹1)." },
    { id: "faq-5", question: "How do I connect a receipt printer?", answer: "Go to Settings > Hardware & Devices, and enter the Receipt Printer IP." },
    { id: "faq-6", question: "How do I restore my account?", answer: "If you are locked out, contact Support via Live Chat or Email for an account reset link." },
  ]);

  const [articles] = useState([
    { id: "kb-1", category: "Getting Started", title: "POS User Guide", description: "Learn the basics of the point of sale interface.", date: "2023-09-15" },
    { id: "kb-2", category: "Inventory", title: "Inventory Management Guide", description: "How to track stock, manage suppliers, and handle POs.", date: "2023-10-01" },
    { id: "kb-3", category: "Customers", title: "Customer Management & Loyalty", description: "Setting up your CRM and loyalty programs.", date: "2023-08-20" },
    { id: "kb-4", category: "Hardware", title: "Hardware Setup Guide", description: "Connecting printers, scanners, and cash drawers.", date: "2023-11-05" },
    { id: "kb-5", category: "Troubleshooting", title: "Network Connection Issues", description: "Steps to resolve offline mode errors.", date: "2023-10-25" },
  ]);

  const [tickets, setTickets] = useState([
    { id: "TKT-1001", subject: "Printer not printing receipts", category: "Hardware", priority: "High", status: "Open", date: "2023-10-15" },
    { id: "TKT-1002", subject: "Inventory count variance", category: "Inventory", priority: "Medium", status: "In Progress", date: "2023-10-14" },
    { id: "TKT-1003", subject: "How to update tax rates", category: "Account Management", priority: "Low", status: "Resolved", date: "2023-09-28" },
  ]);

  const addTicket = (ticketData) => {
    const newTicket = {
      id: `TKT-${1000 + tickets.length + 1}`,
      ...ticketData,
      status: "Open",
      date: new Date().toISOString().split('T')[0],
    };
    setTickets([newTicket, ...tickets]);
  };

  return (
    <SupportContext.Provider value={{ faqs, articles, tickets, addTicket }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error("useSupport must be used within a SupportProvider");
  }
  return context;
}
