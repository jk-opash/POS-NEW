import { Dropdown } from "@/components/ui/Dropdown";
import { Text } from "@/components/ui/Text";
import {
  ADDON_GROUPS,
  FOOD_TYPE,
  MENU_CATEGORIES,
  SUBCATEGORY_ICONS,
} from "@/constants/menu";
import { useMenu } from "@/context/MenuContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { showAlert } from "@/utils/alert";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function MenuItemWizardModal({ visible, onClose, onSave, initialData }) {
  const { isMobile, isMiniTab } = useResponsive();
  const { menuItems } = useMenu();
  const [currentStep, setCurrentStep] = useState(0);

  const categoryOptions = MENU_CATEGORIES.map((cat) => ({
    label: cat,
    value: cat,
  }));

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subCategory: "",
    description: "",
    foodType: FOOD_TYPE.VEG,
    sellingPrice: "",
    costPrice: "",
    variants: [],
    customAddonGroups: [],
    spiceLevelEnabled: false,
    image: null,
    status: "Active",
  });

  const subCategoryOptions = (() => {
    if (!formData.category) {
      return Object.keys(SUBCATEGORY_ICONS).map((sub) => ({
        label: sub,
        value: sub,
      }));
    }

    const related = new Set(
      menuItems
        .filter((item) => item.category === formData.category)
        .map((item) => item.subCategory)
        .filter(Boolean),
    );

    if (formData.subCategory) {
      related.add(formData.subCategory);
    }

    if (related.size === 0) {
      return Object.keys(SUBCATEGORY_ICONS).map((sub) => ({
        label: sub,
        value: sub,
      }));
    }

    return Array.from(related).map((sub) => ({
      label: sub,
      value: sub,
    }));
  })();

  const handleImageUpload = () => {
    showAlert(
      "Upload Image",
      "In a real app, this would open the image picker.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mock Upload",
          onPress: () =>
            setFormData({ ...formData, image: "https://picsum.photos/200" }),
        },
      ],
    );
  };

  const STEPS = ["Basic Info", "Pricing & Variants", "Add-ons & Options"];

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      if (initialData) {
        let combinedCustomAddons = (initialData.customAddonGroups || []).map(
          (g) => ({
            ...g,
            addons: g.addons.map((a) => ({ ...a, price: a.price.toString() })),
          }),
        );

        if (initialData.addonGroups && initialData.addonGroups.length > 0) {
          initialData.addonGroups.forEach((groupId) => {
            const group = ADDON_GROUPS.find((g) => g.id === groupId);
            if (group) {
              combinedCustomAddons.push({
                ...group,
                id: `AG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                addons: group.addons.map((a) => ({
                  id: `A-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name: a.name,
                  price: (a.price || 0).toString(),
                })),
              });
            }
          });
        }

        setFormData({
          name: initialData.name || "",
          category: initialData.category || "",
          subCategory: initialData.subCategory || "",
          description: initialData.description || "",
          foodType: initialData.foodType || FOOD_TYPE.VEG,
          sellingPrice: initialData.pricing?.sellingPrice?.toString() || "",
          costPrice: initialData.pricing?.costPrice?.toString() || "",
          variants: initialData.variants
            ? initialData.variants.map((v) => ({
                ...v,
                price: v.price.toString(),
              }))
            : [],
          customAddonGroups: combinedCustomAddons,
          spiceLevelEnabled: initialData.spiceLevelEnabled || false,
          image: initialData.image || null,
          status: initialData.status || "Active",
        });
      } else {
        setFormData({
          name: "",
          category: "",
          subCategory: "",
          description: "",
          foodType: FOOD_TYPE.VEG,
          sellingPrice: "",
          costPrice: "",
          variants: [],
          customAddonGroups: [],
          spiceLevelEnabled: false,
          image: null,
          status: "Active",
        });
      }
    }
  }, [visible, initialData]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Submit
      const payload = {
        ...(initialData || {}),
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        foodType: formData.foodType,
        pricing: {
          sellingPrice: parseFloat(formData.sellingPrice) || 0,
          costPrice: parseFloat(formData.costPrice) || 0,
        },
        variants: formData.variants
          .filter((v) => v.name.trim() !== "")
          .map((v) => ({
            id:
              v.id ||
              `V-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: v.name,
            price: parseFloat(v.price) || 0,
          })),
        customAddonGroups: formData.customAddonGroups
          .map((group) => ({
            ...group,
            addons: group.addons
              .filter((a) => a.name.trim() !== "")
              .map((a) => ({
                id:
                  a.id ||
                  `A-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: a.name,
                price: parseFloat(a.price) || 0,
              })),
          }))
          .filter(
            (group) => group.name.trim() !== "" && group.addons.length > 0,
          ),
        addonGroups: [],
        spiceLevelEnabled: formData.spiceLevelEnabled,
        image: formData.image,
        status: formData.status,
      };

      if (onSave) {
        onSave(payload);
      }
      onClose();
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const modalWidth = isMobile || isMiniTab ? "100%" : 650;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile || isMiniTab ? "slide" : "fade"}
    >
      {console.log("visible", initialData)}
      <View style={styles.overlay}>
        <View style={[styles.container, { width: modalWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                {initialData ? "Edit Menu Item" : "Create New Menu Item"}
              </Text>
              <Text style={styles.subtitle}>
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Stepper Header */}
          <View style={styles.stepperWrap}>
            {STEPS.map((step, index) => (
              <View key={step} style={styles.stepIndicator}>
                <View
                  style={[
                    styles.stepDot,
                    index <= currentStep && styles.stepDotActive,
                  ]}
                >
                  {index < currentStep ? (
                    <CheckCircle2 size={12} color={ThemeColors.white} />
                  ) : (
                    <Text weight="bold" style={styles.stepNum}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepText,
                    index <= currentStep && styles.stepTextActive,
                  ]}
                >
                  {step}
                </Text>
                {index < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      index < currentStep && styles.stepLineActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.content}
          >
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <View style={styles.stepContainer}>
                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Menu Item Name *
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Masala Dosa"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={formData.name}
                    onChangeText={(val) =>
                      setFormData({ ...formData, name: val })
                    }
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>
                      Category
                    </Text>
                    <Dropdown
                      options={categoryOptions}
                      value={formData.category}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          category: val,
                          subCategory: "",
                        })
                      }
                      placeholder="Select Category"
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>
                      Sub Category
                    </Text>
                    <Dropdown
                      options={subCategoryOptions}
                      value={formData.subCategory}
                      onChange={(val) =>
                        setFormData({ ...formData, subCategory: val })
                      }
                      placeholder="Select Sub Category"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Food Type
                  </Text>
                  <View
                    style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}
                  >
                    {Object.values(FOOD_TYPE).map((type) => {
                      const isActive = formData.foodType === type;
                      let typeColor = ThemeColors.primary;
                      switch (type) {
                        case "Veg":
                          typeColor = ThemeColors.veg;
                          break;
                        case "Non-Veg":
                          typeColor = ThemeColors.nonVeg;
                          break;
                        case "Egg":
                          typeColor = ThemeColors.egg;
                          break;
                        case "Vegan":
                          typeColor = ThemeColors.vegan;
                          break;
                        case "Jain":
                          typeColor = ThemeColors.jain;
                          break;
                        case "Dessert":
                          typeColor = ThemeColors.blue;
                          break;
                        case "Beverage":
                          typeColor = ThemeColors.violet;
                          break;
                      }

                      return (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.foodTypeChip,
                            isActive && {
                              borderColor: typeColor,
                              backgroundColor: typeColor + "15",
                            },
                          ]}
                          onPress={() =>
                            setFormData({ ...formData, foodType: type })
                          }
                        >
                          <Text
                            style={[
                              styles.foodTypeText,
                              isActive && {
                                color: typeColor,
                                fontWeight: "bold",
                              },
                            ]}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Item Image
                  </Text>
                  <TouchableOpacity
                    style={styles.imageUpload}
                    onPress={handleImageUpload}
                  >
                    {formData.image ? (
                      <Image
                        source={{ uri: formData.image }}
                        style={{
                          width: "100%",
                          height: 100,
                          borderRadius: ThemeRadius.md,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <>
                        <Upload size={24} color={ThemeColors.textSecondary} />
                        <Text style={styles.uploadText}>
                          Click to upload image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {formData.image && (
                    <TouchableOpacity
                      onPress={() => setFormData({ ...formData, image: null })}
                      style={{ marginTop: 8 }}
                    >
                      <Text style={{ color: ThemeColors.red, fontSize: 12 }}>
                        Remove Image
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Step 2: Pricing & Variants */}
            {currentStep === 1 && (
              <View style={styles.stepContainer}>
                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>
                      Base Selling Price (₹) *
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={formData.sellingPrice}
                      onChangeText={(val) =>
                        setFormData({ ...formData, sellingPrice: val })
                      }
                    />
                  </View>
                </View>

                <View>
                  <Text weight="bold" style={styles.sectionTitle}>
                    Variants (Optional)
                  </Text>
                  <Text style={styles.hintText}>
                    E.g., Half/Full, Small/Large. Variant prices will override
                    the base price in the POS.
                  </Text>

                  {formData.variants.map((v, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <TextInput
                        placeholder="Variant Name"
                        placeholderTextColor={ThemeColors.textMuted}
                        value={v.name}
                        onChangeText={(val) => {
                          const newV = [...formData.variants];
                          newV[idx].name = val;
                          setFormData({ ...formData, variants: newV });
                        }}
                        style={[styles.input, { flex: 2, marginBottom: 0 }]}
                      />
                      <TextInput
                        placeholder="Price (₹)"
                        placeholderTextColor={ThemeColors.textMuted}
                        keyboardType="numeric"
                        value={v.price}
                        onChangeText={(val) => {
                          const newV = [...formData.variants];
                          newV[idx].price = val;
                          setFormData({ ...formData, variants: newV });
                        }}
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setFormData({
                            ...formData,
                            variants: formData.variants.filter(
                              (_, i) => i !== idx,
                            ),
                          });
                        }}
                        style={{ padding: 4 }}
                      >
                        <X size={20} color={ThemeColors.red} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setFormData({
                      ...formData,
                      variants: [
                        ...formData.variants,
                        { id: "", name: "", price: "" },
                      ],
                    })
                  }
                  style={[
                    styles.btnSecondary,
                    { alignSelf: "flex-start", marginTop: 12 },
                  ]}
                >
                  <Plus size={16} color={ThemeColors.textPrimary} />
                  <Text weight="semibold" style={styles.btnSecondaryText}>
                    Add Variant
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Add-ons & Options */}
            {currentStep === 2 && (
              <View style={styles.stepContainer}>
                <View style={[styles.switchGroup]}>
                  <View>
                    <Text weight="semibold" style={styles.label}>
                      Enable Spice Level?
                    </Text>
                    <Text style={styles.hintText}>
                      Allows the customer to choose spice level (Mild, Medium,
                      Spicy, etc.)
                    </Text>
                  </View>
                  <Switch
                    value={formData.spiceLevelEnabled}
                    onValueChange={(val) =>
                      setFormData({ ...formData, spiceLevelEnabled: val })
                    }
                    trackColor={{
                      false: ThemeColors.border,
                      true: ThemeColors.emerald,
                    }}
                  />
                </View>

                <View>
                  <Text
                    weight="semibold"
                    style={{ fontSize: 16, color: ThemeColors.textPrimary }}
                  >
                    Custom Add-on Categories
                  </Text>
                  <Text style={styles.hintText}>
                    Build specific add-on groups for this item (e.g. "Choice of
                    Bread", "Extra Toppings").
                  </Text>
                </View>

                <View style={{ gap: ThemeSpacing.lg }}>
                  {formData.customAddonGroups.map((group, groupIdx) => (
                    <View
                      key={groupIdx}
                      style={styles.customAddonGroupContainer}
                    >
                      <View style={styles.customAddonGroupHeader}>
                        <TextInput
                          placeholder="Category Name (e.g. Extra Toppings)"
                          placeholderTextColor={ThemeColors.textMuted}
                          style={[
                            styles.input,
                            { flex: 1, marginBottom: 0, fontWeight: "600" },
                          ]}
                          value={group.name}
                          onChangeText={(val) => {
                            const newGroups = [...formData.customAddonGroups];
                            newGroups[groupIdx].name = val;
                            setFormData({
                              ...formData,
                              customAddonGroups: newGroups,
                            });
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setFormData({
                              ...formData,
                              customAddonGroups:
                                formData.customAddonGroups.filter(
                                  (_, i) => i !== groupIdx,
                                ),
                            });
                          }}
                          style={styles.deleteGroupBtn}
                        >
                          <Trash2 size={18} color={ThemeColors.red} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.row}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                          <Text style={styles.hintText}>Min Selection</Text>
                          <TextInput
                            style={[styles.input, { padding: 8 }]}
                            keyboardType="numeric"
                            value={group.minSelect.toString()}
                            onChangeText={(val) => {
                              const newGroups = [...formData.customAddonGroups];
                              newGroups[groupIdx].minSelect =
                                parseInt(val) || 0;
                              setFormData({
                                ...formData,
                                customAddonGroups: newGroups,
                              });
                            }}
                          />
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                          <Text style={styles.hintText}>Max Selection</Text>
                          <TextInput
                            style={[styles.input, { padding: 8 }]}
                            keyboardType="numeric"
                            value={group.maxSelect.toString()}
                            onChangeText={(val) => {
                              const newGroups = [...formData.customAddonGroups];
                              newGroups[groupIdx].maxSelect =
                                parseInt(val) || 0;
                              setFormData({
                                ...formData,
                                customAddonGroups: newGroups,
                              });
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.addonsList}>
                        {group.addons.map((addon, addonIdx) => (
                          <View key={addonIdx} style={styles.addonItemRow}>
                            <TextInput
                              placeholder="Add-on Name"
                              placeholderTextColor={ThemeColors.textMuted}
                              style={[
                                styles.input,
                                { flex: 2, padding: 8, marginBottom: 0 },
                              ]}
                              value={addon.name}
                              onChangeText={(val) => {
                                const newGroups = [
                                  ...formData.customAddonGroups,
                                ];
                                newGroups[groupIdx].addons[addonIdx].name = val;
                                setFormData({
                                  ...formData,
                                  customAddonGroups: newGroups,
                                });
                              }}
                            />
                            <TextInput
                              placeholder="Price (₹)"
                              keyboardType="numeric"
                              placeholderTextColor={ThemeColors.textMuted}
                              style={[
                                styles.input,
                                { flex: 1, padding: 8, marginBottom: 0 },
                              ]}
                              value={addon.price}
                              onChangeText={(val) => {
                                const newGroups = [
                                  ...formData.customAddonGroups,
                                ];
                                newGroups[groupIdx].addons[addonIdx].price =
                                  val;
                                setFormData({
                                  ...formData,
                                  customAddonGroups: newGroups,
                                });
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                const newGroups = [
                                  ...formData.customAddonGroups,
                                ];
                                newGroups[groupIdx].addons = newGroups[
                                  groupIdx
                                ].addons.filter((_, i) => i !== addonIdx);
                                setFormData({
                                  ...formData,
                                  customAddonGroups: newGroups,
                                });
                              }}
                            >
                              <X size={18} color={ThemeColors.red} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          const newGroups = [...formData.customAddonGroups];
                          newGroups[groupIdx].addons.push({
                            id: "",
                            name: "",
                            price: "",
                          });
                          setFormData({
                            ...formData,
                            customAddonGroups: newGroups,
                          });
                        }}
                        style={[
                          styles.btnSecondary,
                          {
                            alignSelf: "flex-start",
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                          },
                        ]}
                      >
                        <Plus size={14} color={ThemeColors.textPrimary} />
                        <Text
                          weight="semibold"
                          style={[styles.btnSecondaryText, { fontSize: 13 }]}
                        >
                          Add Option
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() =>
                    setFormData({
                      ...formData,
                      customAddonGroups: [
                        ...formData.customAddonGroups,
                        {
                          id: `AG-${Date.now()}`,
                          name: "",
                          minSelect: 0,
                          maxSelect: 1,
                          addons: [{ id: "", name: "", price: "" }],
                        },
                      ],
                    })
                  }
                  style={[
                    styles.btnSecondary,
                    { alignSelf: "flex-start", marginTop: ThemeSpacing.sm },
                  ]}
                >
                  <Plus size={16} color={ThemeColors.textPrimary} />
                  <Text weight="semibold" style={styles.btnSecondaryText}>
                    Create Add-on Category
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.btnSecondary, currentStep === 0 && { opacity: 0 }]}
              onPress={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={18} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.btnSecondaryText}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
              <Text weight="bold" style={styles.btnPrimaryText}>
                {currentStep === STEPS.length - 1
                  ? initialData
                    ? "Save Changes"
                    : "Create Menu Item"
                  : "Next Step"}
              </Text>
              {currentStep < STEPS.length - 1 && (
                <ChevronRight size={18} color={ThemeColors.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.md,
  },
  container: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    maxHeight: "90%",
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 4,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: ThemeColors.bg,
    borderRadius: 20,
  },
  stepperWrap: {
    flexDirection: "row",
    padding: ThemeSpacing.lg,
    paddingHorizontal: ThemeSpacing.xl,
    backgroundColor: ThemeColors.bg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: ThemeColors.emerald,
  },
  stepNum: {
    fontSize: 10,
    color: ThemeColors.textMuted,
  },
  stepText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginLeft: 8,
  },
  stepTextActive: {
    color: ThemeColors.emerald,
    fontWeight: "bold",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: ThemeColors.border,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: ThemeColors.emerald,
  },
  contentScroll: {
    flexShrink: 1,
  },
  content: {
    padding: ThemeSpacing.xl,
  },
  stepContainer: {
    gap: ThemeSpacing.md,
  },
  row: {
    flexDirection: "row",
    gap: ThemeSpacing.lg,
  },
  formGroup: {
    gap: ThemeSpacing.sm,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  input: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  imageUpload: {
    height: 100,
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderStyle: "dashed",
    borderRadius: ThemeRadius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  hintText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  foodTypeChip: {
    flex: 1,
    alignItems: "center",
    padding: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.surface,
  },
  foodTypeChipActive: {
    borderColor: ThemeColors.primary,
    backgroundColor: ThemeColors.primary + "15",
  },
  foodTypeText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
  foodTypeTextActive: {
    color: ThemeColors.primary,
    fontWeight: "bold",
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ThemeColors.surfaceElevated,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  customAddonGroupContainer: {
    padding: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: ThemeSpacing.sm,
  },
  customAddonGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  deleteGroupBtn: {
    padding: 8,
    backgroundColor: ThemeColors.red + "15",
    borderRadius: ThemeRadius.sm,
  },
  addonsList: {
    marginTop: ThemeSpacing.sm,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    paddingTop: ThemeSpacing.sm,
  },
  addonItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: ThemeSpacing.xl,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  btnSecondaryText: {
    color: ThemeColors.textPrimary,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.primary,
  },
  btnPrimaryText: {
    color: ThemeColors.white,
  },
});
