import LoginViewPage from '@/src/features/auth/components/login-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trinetra | Login',
  description: 'Login page for authentication.'
};

export default function Page() {
  return <LoginViewPage />;
}
