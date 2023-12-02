import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { MapRef } from 'react-map-gl';

interface ContextValue {
  mapRef: React.RefObject<MapRef>; // Replace 'any' with the specific type of your mapRef
  containerRef:  React.RefObject<HTMLDivElement | null>;
}

const Context = createContext<ContextValue | undefined>(undefined);

export const useValue = (): ContextValue => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useValue must be used within a ContextProvider');
  }
  return context;
};

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider = ({ children }: ContextProviderProps) => {
  const mapRef = useRef<MapRef>(null); // Replace 'any' with the specific type of your mapRef
  const containerRef =  useRef<HTMLDivElement | null>(null);
  const contextValue: ContextValue = {
    mapRef,
    containerRef,
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
