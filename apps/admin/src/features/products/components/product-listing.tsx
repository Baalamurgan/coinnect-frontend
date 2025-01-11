import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { searchParamsCache } from '@/lib/searchparams';
import { fetchAllItems } from 'services/item/services';
import { toast } from 'sonner';
import { Item } from 'types/api';
import { columns } from './product-tables/columns';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const limit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const itemResponse = await fetchAllItems(filters);
  if (itemResponse.error) {
    toast.error('Error fetching items');
  }

  const data = {
    success: true,
    time: new Date().getTime(),
    message: 'Sample data for testing and learning purposes',
    total_products: itemResponse.data?.length || 0,
    offset: (page - 1) * limit,
    limit,
    products: itemResponse.data || []
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
