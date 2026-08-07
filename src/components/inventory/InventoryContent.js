import { AdjustmentsTab } from "@/components/inventory/AdjustmentsTab";
import { AuditLogTab } from "@/components/inventory/AuditLogTab";
import { StockListTab } from "@/components/inventory/StockListTab";

export function InventoryContent({ activeTab, onEditItem }) {
  switch (activeTab) {
    case "stock":
      return <StockListTab onEditItem={onEditItem} />;
    case "adjustments":
      return <AdjustmentsTab />;
    case "audit":
      return <AuditLogTab />;
    default:
      return null;
  }
}
