"use client";
import { Provider } from "react-redux";
import React, { ReactNode } from "react";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

interface ReduxProviderProps {
  children: ReactNode;
}

const RehydrateLoader = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
    <div className="text-center space-y-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent mx-auto" />
      <p className="text-sm text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<RehydrateLoader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;