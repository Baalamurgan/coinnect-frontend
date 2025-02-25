import { orderService } from '@/services/order/services';
import { Order } from '@/services/order/types';
import NotFound from '@/src/app/not-found';
import { DataTable as ProductTable } from '@/src/components/ui/table/data-table';
import { searchParamsCache } from '@/src/lib/searchparams';
import { columns } from './order-tables/columns';

type OrderListingPage = {};

export default async function OrderListingPage({}: OrderListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const name = searchParamsCache.get('name');
  const email = searchParamsCache.get('email');
  const limit = searchParamsCache.get('limit');
  const status = searchParamsCache.get('status');

  const filters = {
    page: page || 1,
    limit,
    name,
    email,
    ...(status && { status: status.join(',') })
  };

  const orderResponse = await orderService.getAll(
    {},
    {
      params: filters
    }
  );

  if (orderResponse.error) {
    // toast.error('Error fetching orders');
    return <NotFound />;
  }

  const data = {
    success: true,
    time: new Date().getTime(),
    message: 'Sample data for testing and learning purposes',
    total_products: orderResponse.data?.pagination.total_records || 0,
    offset: (page - 1) * limit,
    limit,
    products: orderResponse.data?.orders || []
  };

  return (
    <ProductTable<Order, {}>
      columns={columns}
      data={data.products}
      totalItems={data.total_products}
      columnVisibility={{
        billable_amount_paid: false,
        user_id: false,
        updated_at: false
      }}
    />
  );
}
