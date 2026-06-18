import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./features/userSlice";
import friendRequestDetailsSlice from "./features/friendRequestSlice";
import friendListSlice from "./features/friendListSlice";
import groupListSlice from "./features/groupSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // ✅ only persist user session
};

const rootReducer = combineReducers({
  user: userReducer,
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

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;