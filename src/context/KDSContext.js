import { createContext, useContext, useState } from "react";

const KDSContext = createContext();

export const useKDS = () => useContext(KDSContext);

// No mock orders, starting fresh

export const KDSProvider = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [stations, setStations] = useState([
    "All",
    "Main Kitchen",
    "Tandoor",
    "Chinese",
    "South Indian",
    "Beverage",
    "Bakery",
  ]);

  const markReadyItemsAsServed = (orderId) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((item) => {
          if (item.status === "Done" || item.status === "Completed" || item.status === "Ready") {
            return { ...item, status: "Served" };
          }
          return item;
        });

        // Calculate order status
        let newOrderStatus = order.status;
        const statuses = updatedItems.map((i) => i.status);

        if (statuses.some((s) => s === "Preparing")) {
          newOrderStatus = "Preparing";
        } else if (statuses.every((s) => s === "Done" || s === "Served" || s === "Completed" || s === "Cancelled")) {
          newOrderStatus = "Completed"; 
        } else if (statuses.some((s) => s === "Done" || s === "Served")) {
          newOrderStatus = "Preparing"; 
        } else if (statuses.every((s) => s === "Accepted")) {
          newOrderStatus = "Accepted";
        }

        return { ...order, items: updatedItems, status: newOrderStatus };
      })
    );
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        // Also update all items' statuses to match the order
        const updatedItems = order.items.map((item) => ({ ...item, status: newStatus }));
        return { ...order, status: newStatus, items: updatedItems };
      })
    );
  };

  const updateItemStatus = (orderId, itemId, newStatus) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );

        // Calculate order status
        let newOrderStatus = order.status;
        const statuses = updatedItems.map((i) => i.status);

        if (statuses.some((s) => s === "Preparing")) {
          newOrderStatus = "Preparing";
        } else if (statuses.every((s) => s === "Done" || s === "Served" || s === "Completed" || s === "Cancelled")) {
          newOrderStatus = "Completed"; // Automatically bump the ticket
        } else if (statuses.some((s) => s === "Done" || s === "Served")) {
          newOrderStatus = "Preparing"; // Partially ready means still preparing
        } else if (statuses.every((s) => s === "Accepted")) {
          newOrderStatus = "Accepted";
        }

        return { ...order, items: updatedItems, status: newOrderStatus };
      })
    );
  };

  const cancelItemInKDS = (itemId) => {
    setActiveOrders((prev) => {
      return prev.map((order) => {
        const itemExists = order.items.some((i) => i.id === itemId);
        if (!itemExists) return order;

        const updatedItems = order.items.filter((item) => item.id !== itemId);
        
        // Recalculate order status
        let newOrderStatus = order.status;
        const statuses = updatedItems.map((i) => i.status);

        if (statuses.length === 0) {
          newOrderStatus = "Completed"; // If no items left, complete/bump ticket
        } else if (statuses.some((s) => s === "Preparing")) {
          newOrderStatus = "Preparing";
        } else if (statuses.every((s) => s === "Done" || s === "Served" || s === "Completed" || s === "Cancelled")) {
          newOrderStatus = "Completed";
        } else if (statuses.some((s) => s === "Done" || s === "Served")) {
          newOrderStatus = "Preparing";
        } else if (statuses.every((s) => s === "Accepted")) {
          newOrderStatus = "Accepted";
        }

        return { ...order, items: updatedItems, status: newOrderStatus };
      }).filter(order => order.items.length > 0);
    });
  };

  const updateItemQtyInKDS = (itemId, qty) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        const itemExists = order.items.some((i) => i.id === itemId);
        if (!itemExists) return order;

        const updatedItems = order.items.map((item) =>
          item.id === itemId ? { ...item, qty: qty } : item
        );

        return { ...order, items: updatedItems };
      })
    );
  };

  const updateOrderPriority = (orderId, newPriority) => {
    setActiveOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, priority: newPriority } : order,
      ),
    );
  };

  const markAsCompleted = (orderId) => {
    updateOrderStatus(orderId, "Completed");
    // In a real app, we might move this to a history array
  };

  // Called when an order is billed/paid — removes all KDS tickets for that table
  const completeTableOrdersInKDS = (tableName) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        const matchesTable = tableName
          ? order.table === `Table ${tableName}` || order.table === tableName
          : false;
        if (!matchesTable) return order;
        return {
          ...order,
          status: "Completed",
          items: order.items.map((i) => ({ ...i, status: "Served" })),
        };
      }).filter((order) => order.status !== "Completed")
    );
  };

  // Called when a walk-in order (no table) is billed — removes matching ticket by orderId
  const completeOrderInKDS = (orderId) => {
    setActiveOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const addOrderToKDS = (kot) => {
    if (!kot || !kot.items || kot.items.length === 0) return;

    const items = kot.items.map((c) => {
      let modifiers = [];
      if (c.variant) {
        modifiers.push(c.variant.name);
      }
      if (c.addons && c.addons.length > 0) {
        modifiers.push(...c.addons.map(a => a.name));
      }
      
      return {
        id: c.id,
        name: c.product.name,
        qty: c.quantity,
        modifiers: modifiers,
        status: "Accepted",
        note: c.note || "",
      };
    });

    const newTicket = {
      id: `KDS-${kot.kotNumber}`,
      orderNumber: `KOT-${kot.kotNumber}`,
      type: kot.orderType,
      table: kot.table ? `Table ${kot.table.name}` : null,
      customer: kot.customer ? kot.customer.name : "Walk-in",
      status: "Accepted",
      priority: "Normal",
      station: "All",
      startTime: new Date().toISOString(),
      items: items,
      notes: "",
    };

    setActiveOrders((prev) => [...prev, newTicket]);
  };

  const replaceTableOrderInKDS = (tableName, orderData) => {
    // Remove all existing tickets for this table
    setActiveOrders((prev) => prev.filter((o) => o.table !== `Table ${tableName}`));
    // Re-insert the updated order as new tickets
    addOrderToKDS(orderData);
  };

  return (
    <KDSContext.Provider
      value={{
        activeOrders,
        stations,
        updateOrderStatus,
        updateItemStatus,
        updateOrderPriority,
        markAsCompleted,
        addOrderToKDS,
        replaceTableOrderInKDS,
        cancelItemInKDS,
        updateItemQtyInKDS,
        markReadyItemsAsServed,
        completeTableOrdersInKDS,
        completeOrderInKDS,
      }}
    >
      {children}
    </KDSContext.Provider>
  );
};
