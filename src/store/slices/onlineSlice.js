import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_PLATFORMS = [
  { id: 'zomato', name: 'Zomato', isActive: true, storeId: 'ZMT-12345', apiKey: 'zmt_live_abc123', autoAccept: true, themeColor: '#E23744' },
  { id: 'swiggy', name: 'Swiggy', isActive: true, storeId: 'SWG-98765', apiKey: 'swg_live_def456', autoAccept: false, themeColor: '#FC8019' },
  { id: 'ubereats', name: 'Uber Eats', isActive: false, storeId: '', apiKey: '', autoAccept: false, themeColor: '#000000' },
  { id: 'foodpanda', name: 'FoodPanda', isActive: false, storeId: '', apiKey: '', autoAccept: false, themeColor: '#D70F64' },
];

const onlineSlice = createSlice({
  name: 'online',
  initialState: { platforms: DEFAULT_PLATFORMS },
  reducers: {
    updatePlatform: (state, action) => {
      const { id, updates } = action.payload;
      const platform = state.platforms.find(p => p.id === id);
      if (platform) Object.assign(platform, updates);
    }
  }
});

export const { updatePlatform } = onlineSlice.actions;
export default onlineSlice.reducer;
