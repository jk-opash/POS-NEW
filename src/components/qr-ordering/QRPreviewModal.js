import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Download } from "lucide-react-native";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export function QRPreviewModal({ previewTable, onClose, onDownload }) {
  return (
    <Modal visible={!!previewTable} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text weight="bold" style={styles.modalTitle}>
              Table {previewTable?.name} QR
            </Text>
          </View>
          <View style={styles.modalQrWrapper}>
            {previewTable && (
              <QRCode
                value={`https://spicegarden.in/order?table=${previewTable.name}`}
                size={200}
                color={ThemeColors.primary}
                backgroundColor={ThemeColors.white}
              />
            )}
          </View>
          <Text style={styles.modalUrlText}>
            https://spicegarden.in/order?table={previewTable?.name}
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
              <Text weight="bold" style={styles.modalCloseBtnText}>
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalDownloadBtn}
              onPress={() => {
                onDownload(previewTable?.name);
                onClose();
              }}
            >
              <Download size={16} color={ThemeColors.white} />
              <Text weight="bold" style={styles.modalDownloadBtnText}>
                Download
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.xl,
    width: 340,
    alignItems: "center",
  },
  modalHeader: {
    marginBottom: ThemeSpacing.lg,
    width: "100%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, color: ThemeColors.textPrimary },
  modalQrWrapper: {
    padding: ThemeSpacing.md,
    backgroundColor: ThemeColors.white,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    marginBottom: ThemeSpacing.lg,
  },
  modalUrlText: {
    fontSize: 12,
    color: ThemeColors.blue,
    marginBottom: ThemeSpacing.xl,
    textAlign: "center",
  },
  modalActions: { flexDirection: "row", gap: ThemeSpacing.md, width: "100%" },
  modalCloseBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.bg,
    alignItems: "center",
  },
  modalCloseBtnText: { color: ThemeColors.textPrimary, fontSize: 14 },
  modalDownloadBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  modalDownloadBtnText: { color: ThemeColors.white, fontSize: 14 },
});
