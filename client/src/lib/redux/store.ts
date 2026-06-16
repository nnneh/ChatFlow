import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  PERSIST,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userSlice } from "./features/userSlice";             // the slice
import friendRequestDetailsSlice from "./features/friendRequestSlice";
import friendListSlice from "./features/friendListSlice";
import groupListSlice from "./features/groupSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userSlice.reducer,          // ✅ Fixed: use .reducer not the slice object
  requestDetails: friendRequestDetailsSlice,
  friendList: friendListSlice,
  groupList: groupListSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// ── Types ─────────────────────────────────────────────────────────────────────
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;