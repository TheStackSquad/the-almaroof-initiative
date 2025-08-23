// src/redux/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import rootReducer from "../reducer";

// Create a noop storage for SSR to prevent "failed to create sync storage" error
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Use localStorage on client, noop on server to handle SSR properly
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Persist config with proper blacklisting to exclude loading states
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth reducer
  version: 1,
  // Transform to exclude loading states from being persisted
  transforms: [
    {
      in: (inboundState) => {
        // Remove loading states before persisting
        if (inboundState && inboundState.auth) {
          const {
            isLoading,
            isSessionChecking,
            isSignupLoading,
            isSigninLoading,
            isGoogleAuthLoading,
            isProfileLoading,
            ...persistedAuth
          } = inboundState.auth;
          return { ...inboundState, auth: persistedAuth };
        }
        return inboundState;
      },
      out: (outboundState) => outboundState,
    },
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Add all redux-persist actions to ignored list to prevent serialization warnings
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
