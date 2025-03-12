'use client';

import KBar from '@/src/components/kbar';
import AppSidebar from '@/src/components/layout/app-sidebar';
import Header from '@/src/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
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
