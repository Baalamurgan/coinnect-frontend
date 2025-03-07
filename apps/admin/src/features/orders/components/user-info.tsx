import { Profile } from '@/services/auth/types';
import Loader from '@/src/components/Loader';
import React from 'react';

const UserInfo = ({ user }: { user?: Profile | null }) => {
  if (!user) return;
  return (
    <div className='flex'>
      <div className='flex min-w-[200px] max-w-[200px] flex-col gap-y-3 rounded-md border border-gray-600 bg-gray-800 p-5 shadow-lg'>
        {user ? (
          <>
            <p>
              <span className='font-semibold'>Name:</span> {user.username}
            </p>
            <p>
              <span className='font-semibold'>Email:</span> {user.email}
            </p>
          </>
        ) : (
          <Loader innerClassName='h-8 w-8' />
        )}
      </div>
    </div>
  );
};

export default UserInfo;
