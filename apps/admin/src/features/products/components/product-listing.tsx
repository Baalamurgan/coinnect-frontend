import { categoryService } from '@/services/category/services';
import { itemService } from '@/services/item/services';
import { Item } from '@/services/item/types';
import NotFound from '@/src/app/not-found';
import { DataTable as ProductTable } from '@/src/components/ui/table/data-table';
import { searchParamsCache } from '@/src/lib/searchparams';
import { notFound } from 'next/navigation';
import { getColumns } from './product-tables/columns';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const limit = searchParamsCache.get('limit');
  const category_ids = searchParamsCache.get('category_ids');

  const filters = {
    page: page || 1,
    limit,
    ...(search && { search }),
    ...(category_ids && { category_ids: category_ids.join(',') })
  };

  const itemResponse = await itemService.getAll(
    {},
    {
      params: filters
    }
  );
  if (itemResponse.error) {
    // toast.error('Error fetching items');
    return <NotFound />;
  }

  let categories = null;

  const response = await categoryService.getAll();
  if (response.error) {
    notFound();
  } else if (response.data) {
    categories = response.data.categories;
  }

  if (!categories) return notFound();

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
      columns={getColumns(categories)}
      data={data.products}
      totalItems={data.total_products}
      columnVisibility={{
        category_id: false,
        gst: false
      }}
    />
  );
}
