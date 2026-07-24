import { Text } from "@/components/ui/Text";
import { usePermissions } from "@/context/PermissionsContext";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Check, Plus, Shield, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function RolesPermissionsSettings() {
  const { roles, allPermissions, togglePermission, addRole, deleteRole } =
    usePermissions();
  const [newRoleName, setNewRoleName] = useState("");

  // Group permissions by category
  const groups = {};
  allPermissions.forEach((p) => {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p);
  });

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>
        Roles & Permissions
      </Text>
      <Text style={styles.headerSubtitle}>
        Define access controls for each user role. Checkmarks grant access.
      </Text>

      <View style={styles.addRoleContainer}>
        <Text style={styles.addRoleLabel}>Add Custom Role:</Text>
        <View style={styles.addRoleInputGroup}>
          <TextInput
            placeholder="e.g. Supervisor"
            placeholderTextColor={ThemeColors.textMuted}
            style={styles.addRoleInput}
            value={newRoleName}
            onChangeText={setNewRoleName}
          />
          <TouchableOpacity
            style={styles.addRoleBtn}
            onPress={() => {
              if (newRoleName.trim()) {
                addRole(newRoleName.trim());
                setNewRoleName("");
              }
            }}
          >
            <Plus size={16} color={ThemeColors.white} />
            <Text style={styles.addRoleBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        style={styles.matrixScroll}
      >
        <View>
          {/* Header Row: Role Names */}
          <View style={styles.headerRow}>
            <View style={styles.permLabel}>
              <Text weight="bold" style={styles.permLabelText}>
                Permission
              </Text>
            </View>
            {roles.map((role) => (
              <View key={role.id} style={styles.roleCol}>
                <Text weight="bold" style={styles.roleTitle} numberOfLines={1}>
                  {role.name}
                </Text>
                {!role.isSystem && (
                  <TouchableOpacity
                    onPress={() => deleteRole(role.id)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={12} color={ThemeColors.red} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Permission Rows grouped by category */}
          {Object.entries(groups).map(([groupName, perms]) => (
            <View key={groupName}>
              <View style={styles.groupHeader}>
                <Shield size={14} color={ThemeColors.emerald} />
                <Text weight="bold" style={styles.groupTitle}>
                  {groupName}
                </Text>
              </View>
              {perms.map((perm) => (
                <View key={perm.key} style={styles.permRow}>
                  <View style={styles.permLabel}>
                    <Text style={styles.permText}>{perm.label}</Text>
                  </View>
                  {roles.map((role) => {
                    const has = role.permissions.includes(perm.key);
                    return (
                      <TouchableOpacity
                        key={role.id}
                        style={styles.roleCol}
                        onPress={() => togglePermission(role.id, perm.key)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            has && styles.checkboxActive,
                          ]}
                        >
                          {has && <Check size={14} color={ThemeColors.white} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: ThemeSpacing.xl },
  headerTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginBottom: ThemeSpacing.md,
  },
  addRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ThemeSpacing.xl,
    gap: ThemeSpacing.md,
  },
  addRoleLabel: {
    color: ThemeColors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  addRoleInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  addRoleInput: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 8,
    minWidth: 200,
    backgroundColor: ThemeColors.surface,
    color: ThemeColors.textPrimary,
  },
  addRoleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ThemeColors.blue,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 8,
    borderRadius: ThemeRadius.md,
  },
  addRoleBtnText: { color: ThemeColors.white, fontWeight: "bold" },
  matrixScroll: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: ThemeColors.border,
    paddingBottom: ThemeSpacing.md,
    marginBottom: ThemeSpacing.sm,
  },
  permLabel: {
    width: 220,
    justifyContent: "center",
    paddingRight: ThemeSpacing.md,
  },
  permLabelText: { fontSize: 14, color: ThemeColors.textPrimary },
  roleCol: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  roleTitle: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
    textAlign: "center",
  },
  deleteBtn: { marginTop: 2 },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    paddingVertical: ThemeSpacing.md,
    marginTop: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  groupTitle: { fontSize: 14, color: ThemeColors.emerald },
  permRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ThemeSpacing.sm,
    borderBottomWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  permText: { fontSize: 13, color: ThemeColors.textSecondary },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ThemeColors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeColors.bg,
  },
  checkboxActive: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
});
