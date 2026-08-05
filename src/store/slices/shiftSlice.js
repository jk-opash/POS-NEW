import { createSlice } from '@reduxjs/toolkit';

const shiftSlice = createSlice({
  name: 'shift',
  initialState: {
    activeShift: null,
    shiftHistory: [],
  },
  reducers: {
    openShift: (state, action) => {
      const { startingCash, employee } = action.payload;
      state.activeShift = {
        id: `SHIFT-${Date.now()}`,
        employee: employee?.firstName || 'Staff',
        openedAt: new Date().toISOString(),
        startingCash: startingCash,
        expectedCash: startingCash,
        cashSales: 0,
        cashRefunds: 0,
        payInsOuts: 0,
      };
    },
    closeShift: (state, action) => {
      if (!state.activeShift) return;
      const { actualCash, notes } = action.payload;
      const closedShift = {
        ...state.activeShift,
        closedAt: new Date().toISOString(),
        actualCash,
        discrepancy: actualCash - state.activeShift.expectedCash,
        notes: notes || ""
      };
      state.shiftHistory.push(closedShift);
      state.activeShift = null;
    },
    addCashTransaction: (state, action) => {
      if (!state.activeShift) return;
      const { amount, type } = action.payload;
      if (type === 'sale') {
        state.activeShift.expectedCash += amount;
        state.activeShift.cashSales += amount;
      } else if (type === 'refund') {
        state.activeShift.expectedCash -= amount;
        state.activeShift.cashRefunds += amount;
      }
    }
  }
});

export const { openShift, closeShift, addCashTransaction } = shiftSlice.actions;
export default shiftSlice.reducer;
