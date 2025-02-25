'use client';

import KBar from '@/src/components/kbar';
import AppSidebar from '@/src/components/layout/app-sidebar';
import Header from '@/src/components/layout/header';
import Loader from '@/src/components/Loader';
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  console.log(user);

  if (user === undefined)
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
