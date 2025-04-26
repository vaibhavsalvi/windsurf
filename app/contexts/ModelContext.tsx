'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';

// Define the shape of our model state
interface ModelState {
  // Add your model properties here
  data: any;
  loading: boolean;
  error: string | null;
}

// Define the shape of our context
interface ModelContextType {
  state: ModelState;
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the context with a default value
const ModelContext = createContext<ModelContextType | undefined>(undefined);

// Create a provider component
export function ModelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModelState>({
    data: null,
    loading: false,
    error: null,
  });

  const setData = (data: any) => {
    setState(prev => ({ ...prev, data }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const value = {
    state,
    setData,
    setLoading,
    setError,
  };

  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  );
}

// Create a custom hook to use the context
export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
