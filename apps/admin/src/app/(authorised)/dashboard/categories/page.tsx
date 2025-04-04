import PageContainer from '@/src/components/layout/page-container';
import { buttonVariants } from '@/src/components/ui/button';
import { Heading } from '@/src/components/ui/heading';
import { Separator } from '@/src/components/ui/separator';
import CategoryTreeView from '@/src/features/categories/components/CategoryTreeView';
import { cn } from '@/src/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard: Categories'
};

export default async function Page() {
  return (
    <PageContainer>
      <div className='h-full space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Categories'
            description='Click a category node to manage it. Use "+" to add a new one.'
          />
          <Link
            href='/dashboard/categories?is_new_category_modal=true'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <CategoryTreeView />
      </div>
    </PageContainer>
  );
}
