/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from 'react';
import { useBreakpoint } from './BreakpointContext';

type SidebarContextData = {
  isOpen: boolean | null;
  onClose: () => void;
  onOpen: () => void;
};

type SidebarProviderProps = {
  children: React.ReactNode;
};

const SidebarContext = createContext({} as SidebarContextData);

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  const { greaterThan } = useBreakpoint();

  useEffect(() => {
    if (greaterThan('lg')) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        onClose: () => setIsOpen(false),
        onOpen: () => setIsOpen(true),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);