import PageContainer from '@/src/components/layout/page-container';
import { Separator } from '@/src/components/ui/separator';
import CategoryHeader from '@/src/features/categories/components/CategoryHeader';
import CategoryTreeView from '@/src/features/categories/components/CategoryTreeView';

export const metadata = {
  title: 'Dashboard: Categories'
};

export default async function Page() {
  return (
    <PageContainer>
      <div className='h-full space-y-4'>
        <CategoryHeader />
        <Separator />
        <CategoryTreeView />
      </div>
    </PageContainer>
  );
}
