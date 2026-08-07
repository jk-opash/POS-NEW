import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  Download,
  Mail,
  MessageSquare,
  Printer,
  Receipt,
  Smartphone,
  Store,
  Utensils,
  X,
} from "lucide-react-native";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

export function InvoiceDetailsModal({ visible, onClose, invoice }) {
  if (!invoice) return null;

  const isEBill = invoice.billingType === "ebill";
  const isPrint = invoice.billingType === "print";

  const billingLabel = isEBill
    ? "eBill"
    : isPrint
      ? "Print Receipt"
      : "POS Checkout";

  const billingColor = isEBill
    ? ThemeColors.accent
    : isPrint
      ? ThemeColors.blue
      : ThemeColors.emerald;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* ── Header ──────────────────────────────── */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                {invoice.id}
              </Text>
              <Text style={styles.subtitle}>{invoice.type}</Text>
            </View>
            <View style={styles.headerRight}>
              <InvoiceStatusBadge status={invoice.status} />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={22} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Action Bar ──────────────────────────── */}
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionBtn}>
              <Printer size={15} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.actionText}>
                Print
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Mail size={15} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.actionText}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Download size={15} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.actionText}>
                Download
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            {/* Billing type badge */}
            <View
              style={[
                styles.billingBadge,
                { backgroundColor: billingColor + "20" },
              ]}
            >
              <Receipt size={12} color={billingColor} />
              <Text style={[styles.billingBadgeText, { color: billingColor }]}>
                {billingLabel}
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.documentBody}
            showsVerticalScrollIndicator={false}
          >
            {/* ── From / To ───────────────────────── */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text weight="bold" style={styles.sectionTitle}>
                  From
                </Text>
                <Text style={styles.bodyTextBold}>{invoice.store}</Text>
                {!!invoice.storeAddress && (
                  <Text style={styles.bodyText}>{invoice.storeAddress}</Text>
                )}
                <Text style={styles.bodyText}>
                  Cashier: {invoice.cashier}{" "}
                  {invoice.cashierRole ? `(${invoice.cashierRole})` : ""}
                </Text>
              </View>
              <View style={[styles.col, { alignItems: "flex-end" }]}>
                <Text weight="bold" style={styles.sectionTitle}>
                  To
                </Text>
                <Text style={styles.bodyTextBold}>
                  {invoice.customer?.name || "Walk-in"}
                </Text>
                {!!invoice.customer?.phone && (
                  <Text style={styles.bodyText}>{invoice.customer.phone}</Text>
                )}
                {!!invoice.customer?.email && (
                  <Text style={styles.bodyText}>{invoice.customer.email}</Text>
                )}
              </View>
            </View>

            {/* ── Meta (Date / Table / OrderType / Method) ──── */}
            <View style={styles.metaDataRow}>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text weight="bold" style={styles.metaValue}>
                  {new Date(invoice.date).toLocaleDateString()}
                </Text>
                <Text style={styles.metaSubValue}>
                  {new Date(invoice.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              {invoice.table && (
                <View style={styles.metaBox}>
                  <Text style={styles.metaLabel}>Table</Text>
                  <View style={styles.metaIconRow}>
                    <Utensils size={13} color={ThemeColors.textSecondary} />
                    <Text weight="bold" style={styles.metaValue}>
                      {invoice.table}
                    </Text>
                  </View>
                </View>
              )}

              {invoice.orderType && (
                <View style={styles.metaBox}>
                  <Text style={styles.metaLabel}>Order Type</Text>
                  <View style={styles.metaIconRow}>
                    <Store size={13} color={ThemeColors.textSecondary} />
                    <Text weight="bold" style={styles.metaValue}>
                      {invoice.orderType}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Payment</Text>
                {invoice.splitPayments && invoice.splitPayments.length > 1 ? (
                  <>
                    <Text weight="bold" style={styles.metaValue}>
                      {invoice.paymentMethod}
                    </Text>
                    {invoice.splitPayments.map((p, i) => (
                      <Text key={i} style={styles.metaSubValue}>
                        • {p.label ? `${p.label} (${p.method})` : p.method}: ₹
                        {parseFloat(p.amount).toFixed(2)}
                      </Text>
                    ))}
                  </>
                ) : (
                  <Text weight="bold" style={styles.metaValue}>
                    {invoice.paymentMethod}
                  </Text>
                )}
              </View>

              {invoice.orderNumber && (
                <View style={styles.metaBox}>
                  <Text style={styles.metaLabel}>Order #</Text>
                  <Text weight="bold" style={styles.metaValue}>
                    {invoice.orderNumber}
                  </Text>
                </View>
              )}

              {invoice.platform && (
                <View style={styles.metaBox}>
                  <Text style={styles.metaLabel}>Platform</Text>
                  <View style={styles.metaIconRow}>
                    <Smartphone size={13} color={ThemeColors.textSecondary} />
                    <Text weight="bold" style={styles.metaValue}>
                      {invoice.platform}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* ── eBill Contact ──────────────────── */}
            {isEBill &&
              invoice.ebillContact &&
              (invoice.ebillContact.phone || invoice.ebillContact.email) && (
                <View style={styles.ebillBox}>
                  <View style={styles.ebillHeader}>
                    <MessageSquare size={14} color={ThemeColors.accent} />
                    <Text weight="semibold" style={styles.ebillTitle}>
                      eBill Sent To
                    </Text>
                  </View>
                  {!!invoice.ebillContact.phone && (
                    <Text style={styles.ebillContact}>
                      📱 {invoice.ebillContact.phone}
                    </Text>
                  )}
                  {!!invoice.ebillContact.email && (
                    <Text style={styles.ebillContact}>
                      ✉️ {invoice.ebillContact.email}
                    </Text>
                  )}
                </View>
              )}

            {/* ── Items Table ─────────────────────── */}
            <View style={styles.tableHeader}>
              <Text weight="bold" style={[styles.th, { flex: 2 }]}>
                ITEM
              </Text>
              <Text
                weight="bold"
                style={[styles.th, { width: 50, textAlign: "center" }]}
              >
                QTY
              </Text>
              <Text
                weight="bold"
                style={[styles.th, { width: 90, textAlign: "right" }]}
              >
                PRICE
              </Text>
              <Text
                weight="bold"
                style={[styles.th, { width: 90, textAlign: "right" }]}
              >
                TOTAL
              </Text>
            </View>

            {invoice.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text weight="bold" style={styles.tdMain}>
                    {item.name}
                  </Text>
                  {item.sku && item.sku !== "—" && (
                    <Text style={styles.tdSub}>SKU: {item.sku}</Text>
                  )}
                  {item.variant && (
                    <Text style={styles.tdSub}>Variant: {item.variant}</Text>
                  )}
                  {item.addons?.length > 0 && (
                    <Text style={styles.tdSub}>+ {item.addons.join(", ")}</Text>
                  )}
                  {item.note && (
                    <Text style={styles.tdNote}>📝 {item.note}</Text>
                  )}
                  {item.discount > 0 && (
                    <Text
                      style={[styles.tdSub, { color: ThemeColors.emerald }]}
                    >
                      Disc: −₹{item.discount.toFixed(2)}
                    </Text>
                  )}
                </View>
                <Text style={[styles.td, { width: 50, textAlign: "center" }]}>
                  {item.qty}
                </Text>
                <Text style={[styles.td, { width: 90, textAlign: "right" }]}>
                  ₹{(item.unitPrice || 0).toFixed(2)}
                </Text>
                <Text style={[styles.td, { width: 90, textAlign: "right" }]}>
                  ₹{(item.total || 0).toFixed(2)}
                </Text>
              </View>
            ))}

            {/* ── Summary ─────────────────────────── */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ₹{(invoice.subtotal || 0).toFixed(2)}
                </Text>
              </View>
              {(invoice.discount || 0) > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: ThemeColors.emerald },
                    ]}
                  >
                    −₹{invoice.discount.toFixed(2)}
                  </Text>
                </View>
              )}
              {invoice.tax > 0 && invoice.taxRate ? (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      CGST ({(invoice.taxRate / 2).toFixed(1)}%)
                    </Text>
                    <Text style={styles.summaryValue}>
                      ₹{(invoice.tax / 2).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      SGST ({(invoice.taxRate / 2).toFixed(1)}%)
                    </Text>
                    <Text style={styles.summaryValue}>
                      ₹{(invoice.tax / 2).toFixed(2)}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>
                    ₹{(invoice.tax || 0).toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                <Text weight="bold" style={styles.summaryTotalLabel}>
                  Grand Total
                </Text>
                <Text weight="bold" style={styles.summaryTotalValue}>
                  ₹{(invoice.grandTotal || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount Paid</Text>
                <Text style={styles.summaryValue}>
                  ₹{(invoice.amountPaid || 0).toFixed(2)}
                </Text>
              </View>
              {(invoice.outstandingBalance || 0) > 0 && (
                <View style={styles.summaryRow}>
                  <Text weight="bold" style={styles.summaryLabel}>
                    Outstanding
                  </Text>
                  <Text
                    weight="bold"
                    style={[styles.summaryValue, { color: ThemeColors.red }]}
                  >
                    ₹{invoice.outstandingBalance.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>

            {!!invoice.notes && (
              <View style={styles.notesBox}>
                <Text weight="bold" style={styles.notesLabel}>
                  Notes:
                </Text>
                <Text style={styles.notesValue}>{invoice.notes}</Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    ...Platform.select({
      web: { alignItems: "center", justifyContent: "center" },
    }),
  },
  modalContent: {
    backgroundColor: ThemeColors.surface,
    width: "100%",
    height: "90%",
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
    ...Platform.select({
      web: { maxWidth: 720, height: "88%", borderRadius: ThemeRadius.xl },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: { fontSize: 22, color: ThemeColors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: ThemeColors.textSecondary },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  actionBar: {
    flexDirection: "row",
    padding: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.xl,
    backgroundColor: ThemeColors.bg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    gap: ThemeSpacing.sm,
    alignItems: "center",
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  actionText: { fontSize: 13, color: ThemeColors.textPrimary },
  billingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ThemeRadius.xl,
  },
  billingBadgeText: { fontSize: 12, fontWeight: "600" },
  documentBody: { padding: ThemeSpacing.xxl },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.xl,
  },
  col: { gap: 4 },
  sectionTitle: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bodyText: { fontSize: 14, color: ThemeColors.textPrimary },
  bodyTextBold: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    fontWeight: "600",
  },
  metaDataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.xxl,
    gap: ThemeSpacing.xl,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  metaBox: { gap: 4, minWidth: 100 },
  metaLabel: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  metaValue: { fontSize: 14, color: ThemeColors.textPrimary },
  metaSubValue: { fontSize: 12, color: ThemeColors.textSecondary },
  metaIconRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  // eBill
  ebillBox: {
    backgroundColor: ThemeColors.accent + "12",
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.md,
    marginBottom: ThemeSpacing.xl,
    gap: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.accent + "30",
  },
  ebillHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  ebillTitle: { fontSize: 13, color: ThemeColors.accent },
  ebillContact: { fontSize: 14, color: ThemeColors.textPrimary },
  // Table
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: ThemeColors.border,
    paddingBottom: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.md,
  },
  th: { fontSize: 11, color: ThemeColors.textMuted, letterSpacing: 0.5 },
  tableRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    paddingVertical: ThemeSpacing.md,
  },
  tdMain: { fontSize: 14, color: ThemeColors.textPrimary, marginBottom: 2 },
  tdSub: { fontSize: 12, color: ThemeColors.textMuted },
  tdNote: { fontSize: 12, color: ThemeColors.amber, fontStyle: "italic" },
  td: { fontSize: 14, color: ThemeColors.textPrimary },
  // Summary
  summaryBox: {
    marginTop: ThemeSpacing.xl,
    marginLeft: "auto",
    width: "100%",
    maxWidth: 360,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryTotalRow: {
    borderTopWidth: 2,
    borderTopColor: ThemeColors.border,
    borderBottomWidth: 2,
    borderBottomColor: ThemeColors.border,
    paddingVertical: ThemeSpacing.md,
    marginTop: 8,
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: ThemeColors.textSecondary },
  summaryValue: { fontSize: 14, color: ThemeColors.textPrimary },
  summaryTotalLabel: { fontSize: 16, color: ThemeColors.textPrimary },
  summaryTotalValue: { fontSize: 18, color: ThemeColors.emerald },
  notesBox: {
    marginTop: ThemeSpacing.xxl,
    paddingTop: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  notesLabel: { fontSize: 14, color: ThemeColors.textPrimary, marginBottom: 4 },
  notesValue: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontStyle: "italic",
  },
});
