import { createSlice } from '@reduxjs/toolkit';
import { MOCK_MENU_ITEMS } from '@/constants/menu';

const initialState = {
  menuItems: MOCK_MENU_ITEMS,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
    addMenuItem: (state, action) => {
      state.menuItems.unshift(action.payload);
    },
    updateMenuItem: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.menuItems.findIndex(m => m.id === id);
      if (index !== -1) {
        state.menuItems[index] = { ...state.menuItems[index], ...updates };
      }
    },
    bulkUpdate: (state, action) => {
      const { ids, updates } = action.payload;
      state.menuItems.forEach(item => {
        if (ids.includes(item.id)) {
          Object.assign(item, updates);
        }
      });
    },
    deleteMenuItem: (state, action) => {
      state.menuItems = state.menuItems.filter(m => m.id !== action.payload);
    }
  }
});

export const { setMenuItems, addMenuItem, updateMenuItem, bulkUpdate, deleteMenuItem } = menuSlice.actions;

export default menuSlice.reducer;
