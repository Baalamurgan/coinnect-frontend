'use client';

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import Loader from '@/components/Loader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from 'context/AuthContext';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading || user === undefined)
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader />
      </div>
    );

  if (!user) {
    return redirect('/');
  }

  return (
    <KBar>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
