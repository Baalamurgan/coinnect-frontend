import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { searchParamsCache } from '@/lib/searchparams';
import { getAllItems } from 'services/api';
import { Item } from 'types/api';
import { columns } from './product-tables/columns';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await getAllItems(filters);
  const totalProducts = data.total_products;
  const products: Item[] = data.products;

  return (
    <ProductTable<Item, {}>
      columns={columns}
      data={products}
      totalItems={totalProducts}
      columnVisibility={{
        category_id: false,
        gst: false
      }}
    />
  );
}
