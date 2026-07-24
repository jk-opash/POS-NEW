import { AdjustmentsTab } from "@/components/inventory/AdjustmentsTab";
import { AuditLogTab } from "@/components/inventory/AuditLogTab";
import { StockListTab } from "@/components/inventory/StockListTab";

export function InventoryContent({ activeTab }) {
  switch (activeTab) {
    case "stock":
      return <StockListTab />;
    case "adjustments":
      return <AdjustmentsTab />;
    case "audit":
      return <AuditLogTab />;
    default:
      return null;
  }
}
