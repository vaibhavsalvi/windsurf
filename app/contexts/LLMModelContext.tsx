'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';

// Define the shape of our LLM model state
interface LLMModelState {
  input: string;
  output: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  loading: boolean;
  error: string | null;
}

// Define the shape of our context
interface LLMModelContextType {
  state: LLMModelState;
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setModelName: (modelName: string) => void;
  setTemperature: (temperature: number) => void;
  setMaxTokens: (maxTokens: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  generateResponse: () => Promise<void>;
}

// Create the context with a default value
const LLMModelContext = createContext<LLMModelContextType | undefined>(undefined);

// Create a provider component
export function LLMModelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LLMModelState>({
    input: '',
    output: '',
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    loading: false,
    error: null,
  });

  const setInput = (input: string) => {
    setState(prev => ({ ...prev, input }));
  };

  const setOutput = (output: string) => {
    setState(prev => ({ ...prev, output }));
  };

  const setModelName = (modelName: string) => {
    setState(prev => ({ ...prev, modelName }));
  };

  const setTemperature = (temperature: number) => {
    setState(prev => ({ ...prev, temperature }));
  };

  const setMaxTokens = (maxTokens: number) => {
    setState(prev => ({ ...prev, maxTokens }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const generateResponse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Here you would implement your actual API call to your LLM service
      // For now, this is just a placeholder
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: state.input,
          model: state.modelName,
          temperature: state.temperature,
          max_tokens: state.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      setOutput(data.response);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    state,
    setInput,
    setOutput,
    setModelName,
    setTemperature,
    setMaxTokens,
    setLoading,
    setError,
    generateResponse,
  };

  return (
    <LLMModelContext.Provider value={value}>
      {children}
    </LLMModelContext.Provider>
  );
}

// Create a custom hook to use the context
export function useLLMModel() {
  const context = useContext(LLMModelContext);
  if (context === undefined) {
    throw new Error('useLLMModel must be used within a LLMModelProvider');
  }
  return context;
}
