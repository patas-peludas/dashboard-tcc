import { useEffect, useState } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

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

export const useBreakpointtt = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');

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

  const greaterThan = (targetBreakpoint: Breakpoint) => {
    const targetIndex = Object.keys(breakpoints).indexOf(targetBreakpoint);
    const currentBreakpointIndex = Object.keys(breakpoints).indexOf(breakpoint);

    return currentBreakpointIndex > targetIndex;
  };

  const lessThan = (targetBreakpoint: Breakpoint) => {
    const targetIndex = Object.keys(breakpoints).indexOf(targetBreakpoint);
    const currentBreakpointIndex = Object.keys(breakpoints).indexOf(breakpoint);

    return currentBreakpointIndex < targetIndex;
  };

  return { greaterThan, lessThan };
};
