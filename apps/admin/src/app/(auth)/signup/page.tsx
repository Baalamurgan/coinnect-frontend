import { Metadata } from 'next';
import SignInViewPage from '@/src/features/auth/components/sigin-view';

export const metadata: Metadata = {
  title: 'Trinetra | Sign In',
  description: 'Sign In page for authentication.'
};

export default function Page() {
  return <SignInViewPage />;
}
