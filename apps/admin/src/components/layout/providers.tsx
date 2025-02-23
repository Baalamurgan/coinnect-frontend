'use client';
import { AuthProvider } from '@/context/AuthContext';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </>
  );
}
