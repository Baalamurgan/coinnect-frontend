'use client';

import { useAuth } from '@/context/AuthContext';
import KBar from '@/src/components/kbar';
import Loader from '@/src/components/Loader';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { replace } = useRouter();
  console.log(user);

  useEffect(() => {
    if (user) replace('/dashboard');
  }, [user]);

  if (user === undefined || user)
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader />
      </div>
    );

  return <KBar>{children}</KBar>;
}
