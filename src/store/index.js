import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./slices/authSlice";
import branchReducer from "./slices/branchSlice";
import inventoryReducer from "./slices/inventorySlice";
import invoiceReducer from "./slices/invoiceSlice";
import menuReducer from "./slices/menuSlice";
import posReducer from "./slices/posSlice";
import settingsReducer from "./slices/settingsSlice";

const rootReducer = combineReducers({
  branch: branchReducer,
  auth: authReducer,
  menu: menuReducer,
  pos: posReducer,
  inventory: inventoryReducer,
  invoice: invoiceReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["branch", "auth"], // Persist auth so user stays logged in
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
