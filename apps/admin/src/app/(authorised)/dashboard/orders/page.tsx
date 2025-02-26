import PageContainer from '@/src/components/layout/page-container';
import { Heading } from '@/src/components/ui/heading';
import { Separator } from '@/src/components/ui/separator';
import { DataTableSkeleton } from '@/src/components/ui/table/data-table-skeleton';
import OrderListingPage from '@/src/features/orders/components/order-listing';
import OrderTableAction from '@/src/features/orders/components/order-tables/order-table-action';
import { searchParamsCache } from '@/src/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Orders'
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

  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Orders' description='Manage your orders' />
          {/* <Link
            href='/dashboard/products/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link> */}
        </div>
        <Separator />
        <OrderTableAction />
        <Suspense
          // key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <OrderListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
