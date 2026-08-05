import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import branchReducer from './slices/branchSlice';
import posReducer from './slices/posSlice';
import inventoryReducer from './slices/inventorySlice';
import hardwareReducer from './slices/hardwareSlice';
import billingReducer from './slices/billingSlice';
import menuReducer from './slices/menuSlice';
import settingsReducer from './slices/settingsSlice';
import ordersReducer from './slices/ordersSlice';
import kdsReducer from './slices/kdsSlice';
import staffReducer from './slices/staffSlice';
import permissionsReducer from './slices/permissionsSlice';
import onlineReducer from './slices/onlineSlice';
import shiftReducer from './slices/shiftSlice';
import supportReducer from './slices/supportSlice';
import syncReducer from './slices/syncSlice';

const rootReducer = combineReducers({
  branch: branchReducer,
  pos: posReducer,
  inventory: inventoryReducer,
  hardware: hardwareReducer,
  billing: billingReducer,
  menu: menuReducer,
  settings: settingsReducer,
  orders: ordersReducer,
  kds: kdsReducer,
  staff: staffReducer,
  permissions: permissionsReducer,
  online: onlineReducer,
  shift: shiftReducer,
  support: supportReducer,
  sync: syncReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['branch', 'settings', 'hardware'], // Only persist some global slices to avoid huge local storage initially
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
