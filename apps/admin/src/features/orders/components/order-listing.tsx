import { DataTable as ProductTable } from '@/src/components/ui/table/data-table';
import { searchParamsCache } from '@/src/lib/searchparams';
import { itemService } from '@/services/item/services';
import { toast } from 'sonner';
import { Item } from 'types/api';
import { columns } from './product-tables/columns';

type OrderListingPage = {};

export default async function OrderListingPage({}: OrderListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const name = searchParamsCache.get('name');
  const email = searchParamsCache.get('email');
  const limit = searchParamsCache.get('limit');
  const category_ids = searchParamsCache.get('category_ids');

  const filters = {
    page: page || 1,
    limit,
    name,
    email
  };

  const orderResponse = await orderService.fetchAllOrders(
    {},
    {
      params: filters
    }
  );
  if (orderResponse.error) {
    toast.error('Error fetching orders');
  }

  const data = {
    success: true,
    time: new Date().getTime(),
    message: 'Sample data for testing and learning purposes',
    total_products: itemResponse.data?.pagination.total_records || 0,
    offset: (page - 1) * limit,
    limit,
    products: itemResponse.data?.items || []
  };

  return (
    <ProductTable<Item, {}>
      columns={columns}
      data={data.products}
      totalItems={data.total_products}
      columnVisibility={{
        category_id: false,
        gst: false
      }}
    />
  );
}
