'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Toaster } from 'sonner';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { HomeButton } from '@/components/HomeButton';
import WhatsAppButton from '@/components/WhatsAppButton';
import { LanguageProvider } from '@/components/Navbar';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <AuthProvider>
                <LanguageProvider>
                  {children}
                </LanguageProvider>
                <WhatsAppButton />
                <HomeButton />
              </AuthProvider>
              <Toaster position="top-right" />
            </LocalizationProvider>
          </ThemeProvider>
        </NextThemesProvider>
      </QueryClientProvider>
    </>
  );
}
