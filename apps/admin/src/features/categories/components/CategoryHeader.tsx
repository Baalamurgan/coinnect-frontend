'use client';

import { categoryService } from '@/services/category/services';
import { Button, buttonVariants } from '@/src/components/ui/button';
import { Heading } from '@/src/components/ui/heading';
import { cn } from '@/src/lib/utils';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const CategoryHeader = () => {
  return (
    <div className='flex items-start justify-between'>
      <Heading
        title='Categories'
        description='Click a category node to manage it. Use "+" to add a new one.'
      />
      <div className='flex items-center gap-x-3'>
        <Button
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
          onClick={async () => {
            await categoryService
              .sync()
              .then(() => toast.success('Categories synced successfully!'))
              .catch(() => toast.error('Failed to sync categories'));
          }}
        >
          <RefreshCw className='mr-2 h-4 w-4' /> Sync Categories
        </Button>
        <Link
          href='/dashboard/categories?is_new_category_modal=true'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Plus className='mr-2 h-4 w-4' /> Add New
        </Link>
      </div>
    </div>
  );
};

export default CategoryHeader;
