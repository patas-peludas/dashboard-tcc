import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '../styles/quill.snow.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import { Toaster } from 'react-hot-toast';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { BreakpointProvider } from '@/contexts/BreakpointContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      localization={ptBR}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        elements: {
          formButtonPrimary:
            'bg-green-600 hover:bg-green-700 text-sm normal-case',
        },
      }}
      {...pageProps}
    >
      <BreakpointProvider>
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </BreakpointProvider>
      <Toaster />
    </ClerkProvider>
  );
}
