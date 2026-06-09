import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
// import counterSlice from "./reducerSlices/counterSlice";
// import userSlice from "../features/userSlice";
import reduxLogger from "redux-logger"; // Assuming @types/redux-logger is installed

const rootReducer = combineReducers({
//   counter: counterSlice,
  user: userSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => // <--- This is the key change!
    getDefaultMiddleware({
      // Redux-persist dispatches non-serializable actions, so we need to ignore them
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(reduxLogger), // <--- Use .concat() to add your custom middleware
});

export const persistor = persistStore(store);