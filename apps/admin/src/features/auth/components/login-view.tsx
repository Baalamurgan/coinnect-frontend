import { Logo } from '@/components/logo';
import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthLoginForm from './user-auth-login-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function LoginViewPage() {
  return (
    <div className='flex h-screen flex-col gap-y-5'>
      <div className='mt-20 flex items-center justify-center'>
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Logo />
        </div>
      </div>
      <div className='flex items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
            <p className='text-sm text-muted-foreground'>
              Enter your details below to login
            </p>
          </div>
          <UserAuthLoginForm />
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
