/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type BreakpointContextData = {
  breakpoint: Breakpoint | null;
  greaterThan: (targetBreakpoint: Breakpoint) => boolean | null;
  lessThan: (targetBreakpoint: Breakpoint) => boolean | null;
};

type BreakpointProviderProps = {
  children: React.ReactNode;
};

const BreakpointContext = createContext({} as BreakpointContextData);

export function BreakpointProvider({ children }: BreakpointProviderProps) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint);
    };

    if (typeof window !== 'undefined') {
      setBreakpoint(getBreakpoint());

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const getBreakpoint = (): Breakpoint => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth;

      if (windowWidth < 320) {
        return 'xs';
      } else if (windowWidth >= 320 && windowWidth < 768) {
        return 'sm';
      } else if (windowWidth >= 768 && windowWidth < 1024) {
        return 'md';
      } else if (windowWidth >= 1024 && windowWidth < 1280) {
        return 'lg';
      } else if (windowWidth >= 1280 && windowWidth < 1536) {
        return 'xl';
      } else {
        return '2xl';
      }
    } else {
      // Caso seja executado no servidor (SSR), podemos definir um valor padrão, por exemplo, 'md'
      return 'md';
    }
  };

  const breakpoints: {
    [key in Breakpoint]: { greaterThan: number; lessThan: number };
  } = {
    xs: { greaterThan: 0, lessThan: 320 },
    sm: { greaterThan: 320, lessThan: 768 },
    md: { greaterThan: 768, lessThan: 1024 },
    lg: { greaterThan: 1024, lessThan: 1280 },
    xl: { greaterThan: 1280, lessThan: 1536 },
    '2xl': { greaterThan: 1536, lessThan: Infinity }, // O 2xl não possui um limite superior
  };

  const greaterThan = (targetBreakpoint: Breakpoint) => {
    if (breakpoint) {
      const targetIndex = Object.keys(breakpoints).indexOf(targetBreakpoint);
      const currentBreakpointIndex =
        Object.keys(breakpoints).indexOf(breakpoint);

      return currentBreakpointIndex > targetIndex;
    } else {
      return null;
    }
  };

  const lessThan = (targetBreakpoint: Breakpoint) => {
    if (breakpoint) {
      const targetIndex = Object.keys(breakpoints).indexOf(targetBreakpoint);
      const currentBreakpointIndex =
        Object.keys(breakpoints).indexOf(breakpoint);

      return currentBreakpointIndex < targetIndex;
    } else {
      return null;
    }
  };

  return (
    <BreakpointContext.Provider
      value={{
        breakpoint,
        greaterThan,
        lessThan,
      }}
    >
      {children}
    </BreakpointContext.Provider>
  );
}

export const useBreakpoint = () => useContext(BreakpointContext);
