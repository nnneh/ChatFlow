'use client'
import { Provider } from 'react-redux'
import React, { ReactNode } from 'react' // Import ReactNode
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'

// Define the type for the component's props
interface ReduxProviderProps {
  children: ReactNode;
}

// Use the defined interface for your component props
const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider