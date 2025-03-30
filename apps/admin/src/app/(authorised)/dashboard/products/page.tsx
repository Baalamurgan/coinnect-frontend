import { categoryService } from '@/services/category/services';
import PageContainer from '@/src/components/layout/page-container';
import { buttonVariants } from '@/src/components/ui/button';
import { Heading } from '@/src/components/ui/heading';
import { Separator } from '@/src/components/ui/separator';
import { DataTableSkeleton } from '@/src/components/ui/table/data-table-skeleton';
import ProductListingPage from '@/src/features/products/components/product-listing';
import ProductTableAction from '@/src/features/products/components/product-tables/product-table-action';
import { searchParamsCache } from '@/src/lib/searchparams';
import { cn } from '@/src/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Products'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  let categories = null;

  const response = await categoryService.getAll();
  if (response.error) {
    notFound();
  } else if (response.data) {
    categories = response.data.categories;
  }

  if (!categories) return notFound();

  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Products' description='Manage your products' />
          <Link
            href='/dashboard/products/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <ProductTableAction categories={categories} />
        <Suspense
          // key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ProductListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
