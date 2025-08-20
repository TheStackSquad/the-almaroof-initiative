// src/redux/store/store.js

// src/redux/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import rootReducer from "../reducer";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  // Add any reducers you want to persist (or blacklist ones you don't)
  whitelist: ["auth"], // Only persist auth reducer
  // Optionally add version for migrations
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore redux-persist actions
      },
    }),
});

export const persistor = persistStore(store);
export default store;
