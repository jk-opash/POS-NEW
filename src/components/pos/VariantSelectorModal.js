import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

const SPICE_LEVELS = [
  { id: "mild", name: "Mild" },
  { id: "medium", name: "Medium" },
  { id: "spicy", name: "Spicy" },
  { id: "extra_spicy", name: "Extra Spicy" },
];

export function VariantSelectorModal({ visible, product, onClose, onConfirm }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(SPICE_LEVELS[1]); // Default to Medium
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (visible && product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setSelectedSpiceLevel(SPICE_LEVELS[1]); // Reset to Medium
      setSelectedAddons([]);
      setSearchQuery("");
    }
  }, [visible, product]);

  const handleConfirm = () => {
    const finalSpiceLevel = product.spice_level_enabled ? selectedSpiceLevel : null;
    onConfirm(product, selectedVariant, selectedAddons, finalSpiceLevel);
    onClose();
  };

  const handleAddonToggle = (addon, group) => {
    setSelectedAddons((prev) => {
      const isSelected = prev.find((a) => a.name === addon.name);
      if (isSelected) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  if (!visible || !product) return null;

  const hasVariants = product.variants && product.variants.length > 0;
  const hasAddonGroups =
    product.addon_categories && product.addon_categories.length > 0;
  const showSpiceLevel = product.spice_level_enabled === true;

  console.log("product ====> ", product);

  let totalPrice = Number(product.pricing?.sellingPrice || product.price || 0);
  if (selectedVariant) {
    totalPrice = Number(selectedVariant.price) || 0;
  }
  selectedAddons.forEach((addon) => {
    if (addon.price) totalPrice += Number(addon.price);
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                {product.name}
              </Text>
              <Text style={styles.subtitle}>Customize your options</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content} showsVerticalScrollIndicator={false}>
            {hasVariants && (
              <View style={styles.section}>
                <Text weight="bold" style={styles.sectionTitle}>
                  Variation
                </Text>
                <View style={styles.chipsContainer}>
                  {product.variants.map((v, index) => {
                    const isSelected = selectedVariant?.name === v.name;
                    return (
                      <TouchableOpacity
                        key={v.id || index}
                        style={[styles.chip, isSelected && styles.chipActive]}
                        onPress={() => setSelectedVariant(v)}
                      >
                        <Text
                          weight={isSelected ? "bold" : "medium"}
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextActive,
                          ]}
                        >
                          {v.name}
                        </Text>
                        <Text
                          style={[
                            styles.chipPrice,
                            isSelected && styles.chipPriceActive,
                          ]}
                        >
                          ₹{v.price}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Spice Level */}
            {showSpiceLevel && (
              <View style={styles.section}>
                <Text weight="bold" style={styles.sectionTitle}>
                  Spice Level
                </Text>
                <View style={styles.chipsContainer}>
                  {SPICE_LEVELS.map((spice) => {
                    const isSelected = selectedSpiceLevel?.id === spice.id;
                    return (
                      <TouchableOpacity
                        key={spice.id}
                        style={[styles.chip, isSelected && styles.chipActive]}
                        onPress={() => setSelectedSpiceLevel(spice)}
                      >
                        <Text
                          weight={isSelected ? "bold" : "medium"}
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextActive,
                          ]}
                        >
                          {spice.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Add-ons */}
            {hasAddonGroups && (
              <View style={styles.section}>
                <Text weight="bold" style={styles.sectionTitle}>
                  Add-ons
                </Text>

                {/* Addon Categories from API */}
                {product.addon_categories &&
                  product.addon_categories.map((group) => {
                    if (!group || !group.options) return null;

                    const filteredAddons = group.options.filter((a) =>
                      a.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    );

                    if (filteredAddons.length === 0) return null;
                    const isSingleSelect = group.maxSelection === 1;

                    return (
                      <View key={group.id || group.name} style={styles.addonGroup}>
                        <View style={styles.groupHeader}>
                          <Text weight="bold" style={styles.groupTitle}>
                            {group.name}
                          </Text>
                          <Text style={styles.groupSubtitle}>
                            {isSingleSelect ? "Choose 1" : "Choose any"}
                          </Text>
                        </View>

                        <View style={styles.chipsContainer}>
                          {filteredAddons.map((addon, idx) => {
                            const isSelected = selectedAddons.some(
                              (a) => a.name === addon.name,
                            );
                            return (
                              <TouchableOpacity
                                key={addon.id || idx}
                                style={[
                                  styles.chip,
                                  isSelected && styles.chipActive,
                                ]}
                                onPress={() => handleAddonToggle(addon, group)}
                              >
                                <Text
                                  weight={isSelected ? "bold" : "medium"}
                                  style={[
                                    styles.chipText,
                                    isSelected && styles.chipTextActive,
                                  ]}
                                >
                                  {addon.name}
                                </Text>
                                <Text
                                  style={[
                                    styles.chipPrice,
                                    isSelected && styles.chipPriceActive,
                                  ]}
                                >
                                  {addon.price > 0
                                    ? `+₹${addon.price}`
                                    : "Free"}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    );
                  })}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerTotalSection}>
              <Text style={styles.totalLabel}>Item Total</Text>
              <Text weight="bold" style={styles.totalValue}>
                ₹{totalPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleConfirm}>
                <Text weight="bold" style={styles.saveBtnText}>
                  Add to Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.lg,
  },
  keyboardView: {
    width: "100%",
    maxWidth: 700,
  },
  modalContainer: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.xl,
    width: "100%",
    maxHeight: "90%",
    maxWidth: "80%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: ThemeSpacing.xl,
    paddingBottom: ThemeSpacing.xl,
    backgroundColor: ThemeColors.white,
  },
  title: {
    fontSize: 24,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  closeBtn: {
    padding: 10,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.full,
  },
  content: {
    paddingHorizontal: ThemeSpacing.xl,
    backgroundColor: ThemeColors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.full,
    paddingHorizontal: ThemeSpacing.xl,
    height: 52,
    marginBottom: ThemeSpacing.xl,
  },
  searchIcon: {
    marginRight: ThemeSpacing.md,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  section: {
    marginBottom: ThemeSpacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  addonGroup: {
    marginBottom: ThemeSpacing.xl,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.sm,
  },
  groupTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  groupSubtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: ThemeRadius.full,
    overflow: "hidden",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100, // Pill shape
    borderWidth: 1.5,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.white,
  },
  chipActive: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primary,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  chipText: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  chipTextActive: {
    color: ThemeColors.white,
  },
  chipPrice: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
    marginLeft: 8,
  },
  chipPriceActive: {
    color: "rgba(255,255,255,0.8)",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.xl,
    backgroundColor: ThemeColors.white,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.surface,
  },
  footerTotalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  footerActions: {
    flex: 1,
    alignItems: "flex-end",
  },
  saveBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: ThemeRadius.full,
    backgroundColor: ThemeColors.primary,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
    alignItems: "center",
  },
  saveBtnText: {
    color: ThemeColors.white,
    fontSize: 18,
  },
});
