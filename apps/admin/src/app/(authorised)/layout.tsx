'use client';

import { useAuth } from '@/context/AuthContext';
import Loader from '@/src/components/Loader';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user === undefined)
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader />
      </div>
    );

  if (!user) return redirect('/login');

  if (user) return <>{children}</>;
}
