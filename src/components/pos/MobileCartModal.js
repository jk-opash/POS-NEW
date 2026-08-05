import React from "react";
import { Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeColors } from "@/theme/theme";
import { CartPanel } from "./CartPanel";

export function MobileCartModal({
  visible,
  isSmallScreen,
  isFNB,
  isRetail,
  cart,
  runningOrder,
  customer,
  activeTable,
  tables,
  floors,
  onSelectTable,
  orderType,
  onOrderTypeChange,
  onNewTakeaway,
  totals,
  openTabs,
  parkedSales,
  taxRate,
  onCloseCart,
  onCustomerTap,
  onVoidEntireCart,
  onViewTabs,
  onViewParkedSales,
  onUpdateQuantity,
  onVoidItem,
  onAssignStaff,
  onDiscount,
  onParkSale,
  onSplitBill,
  onSendToKitchen,
  onCheckout,
}) {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <CartPanel
          isSmallScreen={isSmallScreen}
          isFNB={isFNB}
          isRetail={isRetail}
          cart={cart}
          runningOrder={runningOrder}
          customer={customer}
          activeTable={activeTable}
          tables={tables}
          floors={floors}
          onSelectTable={onSelectTable}
          orderType={orderType}
          onOrderTypeChange={onOrderTypeChange}
          onNewTakeaway={onNewTakeaway}
          totals={totals}
          openTabs={openTabs}
          parkedSales={parkedSales}
          taxRate={taxRate}
          onCloseCart={onCloseCart}
          onCustomerTap={onCustomerTap}
          onVoidEntireCart={onVoidEntireCart}
          onViewTabs={onViewTabs}
          onViewParkedSales={onViewParkedSales}
          onUpdateQuantity={onUpdateQuantity}
          onVoidItem={onVoidItem}
          onAssignStaff={onAssignStaff}
          onDiscount={onDiscount}
          onParkSale={onParkSale}
          onSplitBill={onSplitBill}
          onSendToKitchen={onSendToKitchen}
          onCheckout={onCheckout}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
  },
});
