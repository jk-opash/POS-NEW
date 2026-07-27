import { Text } from "@/components/ui/Text";
import { useKDS } from "@/context/KDSContext";
import { useOrders } from "@/context/OrdersContext";
import { useTables } from "@/context/TablesContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { showAlert } from "@/utils/alert";
import { useNavigation } from "expo-router";
import { Bell, Menu } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QRPreviewModal } from "@/components/qr-ordering/QRPreviewModal";
import { TableQRCard } from "@/components/qr-ordering/TableQRCard";

const INCOMING_QR_ORDERS = [
  {
    id: "QO-01",
    table: "A3",
    items: [
      { name: "Paneer Tikka", qty: 1 },
      { name: "Masala Chai", qty: 2 },
    ],
    total: 380,
    time: "2m ago",
    status: "Pending",
  },
  {
    id: "QO-02",
    table: "A1",
    items: [
      { name: "Butter Chicken", qty: 1 },
      { name: "Garlic Naan", qty: 2 },
    ],
    total: 510,
    time: "5m ago",
    status: "Accepted",
  },
  {
    id: "QO-03",
    table: "A6",
    items: [
      { name: "Masala Dosa", qty: 2 },
      { name: "Fresh Lime Soda", qty: 2 },
    ],
    total: 460,
    time: "8m ago",
    status: "Sent to KDS",
  },
];

const formatDataForGrid = (data, numColumns) => {
  if (!data || data.length === 0) return [];
  const numberOfElementsLastRow = data.length % numColumns;
  if (numberOfElementsLastRow === 0) return data;

  const paddingNeeded = numColumns - numberOfElementsLastRow;
  const paddedData = [...data];
  for (let i = 0; i < paddingNeeded; i++) {
    paddedData.push({ id: `blank-${i}`, empty: true });
  }
  return paddedData;
};

export function QROrderingScreen() {
  const navigation = useNavigation();
  const { isDesktop, isWebDesktop, isTablet, isMiniTab } = useResponsive();
  const [activeTab, setActiveTab] = useState("qrcodes");
  const [selectedTable, setSelectedTable] = useState(null);
  const [previewTable, setPreviewTable] = useState(null);
  const qrRefs = useRef({});

  const numColumns = isDesktop ? 6 : isTablet ? 4 : isMiniTab ? 2 : 1;
  const numColumns2 = isDesktop ? 4 : isTablet ? 3 : 1;

  const { tables } = useTables();
  const { addOrder } = useOrders();
  const { addOrderToKDS } = useKDS();

  const [qrOrders, setQrOrders] = useState(INCOMING_QR_ORDERS);

  const handleAcceptOrder = (order) => {
    const kotNumber = Math.floor(1000 + Math.random() * 9000);
    const posOrder = {
      id: `POS-${kotNumber}`,
      orderNumber: `ORD-${kotNumber}`,
      table: { name: order.table },
      orderType: "Dine-in",
      customer: { name: "QR Customer" },
      status: "Accepted",
      paymentStatus: "Pending",
      subtotal: order.total,
      tax: 0,
      total: order.total,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cart: order.items.map((item) => ({
        id: Math.random().toString(),
        product: { name: item.name, pricing: { sellingPrice: 0 } },
        quantity: item.qty,
        note: "",
      })),
      kotNumber: kotNumber,
    };

    addOrder(posOrder);
    addOrderToKDS(posOrder);

    setQrOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "Accepted" } : o)),
    );
  };

  const handleRejectOrder = (order) => {
    setQrOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "Rejected" } : o)),
    );
  };

  const handleDownloadQR = (tableName) => {
    const qrRef = qrRefs.current[tableName];
    if (qrRef) {
      qrRef.toDataURL((data) => {
        if (Platform.OS === "web") {
          const link = document.createElement("a");
          link.href = `data:image/png;base64,${data}`;
          link.download = `Table_${tableName}_QR.png`;
          link.click();
        } else {
          showAlert("Success", "QR Code generated.");
        }
      });
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isDesktop && (
              <TouchableOpacity
                onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
                style={styles.menuBtn}
              >
                <Menu size={24} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.pageTitle}>QR Ordering</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={20} color={ThemeColors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {activeTab === "qrcodes" && (
        <View style={styles.ordersContainer}>
          <Text weight="semibold" style={styles.sectionTitle}>
            Table QR Codes — Customers scan to browse menu & place orders
          </Text>
          <FlatList
            data={formatDataForGrid(tables, numColumns)}
            keyExtractor={(item) => item.id}
            key={numColumns}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.rowGap : undefined}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.empty) {
                return <View style={{ flex: 1 }} />;
              }
              return (
                <TableQRCard
                  table={item}
                  isSelected={selectedTable?.id === item.id}
                  onSelect={setSelectedTable}
                  onPreview={setPreviewTable}
                  onDownload={handleDownloadQR}
                  qrRefs={qrRefs}
                />
              );
            }}
          />
        </View>
      )}

      {/* QR Preview Modal */}
      <QRPreviewModal
        previewTable={previewTable}
        onClose={() => setPreviewTable(null)}
        onDownload={handleDownloadQR}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  menuBtn: { padding: 4 },
  pageTitle: { fontSize: 26, color: ThemeColors.textPrimary },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  notifBtn: {
    position: "relative",
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.red,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.xxl,
    gap: ThemeSpacing.lg,
    paddingBottom: ThemeSpacing.md,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: ThemeRadius.md,
  },
  tabActive: { backgroundColor: ThemeColors.accentDim },
  tabText: { fontSize: 14, color: ThemeColors.textMuted },
  tabTextActive: { color: ThemeColors.accent },
  content: { padding: ThemeSpacing.lg, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginBottom: ThemeSpacing.lg,
  },
  qrGrid: { flexDirection: "row", flexWrap: "wrap", gap: ThemeSpacing.md },
  ordersContainer: { flex: 1, padding: ThemeSpacing.lg },
  listContent: {
    paddingBottom: 100,
    gap: ThemeSpacing.lg,
  },
  rowGap: { gap: ThemeSpacing.lg },
});
