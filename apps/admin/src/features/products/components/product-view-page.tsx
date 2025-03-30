import { categoryService } from '@/services/category/services';
import { itemService } from '@/services/item/services';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    const response = await itemService.getById(
      {},
      {},
      {
        item_id: productId
      }
    );
    if (response.error) {
      notFound();
    } else if (response.data) {
      product = response.data;
    }
    pageTitle = `Edit Product`;
  }

  let categories = null;

  const response = await categoryService.getAll();
  if (response.error) {
    notFound();
  } else if (response.data) {
    categories = response.data.categories;
  }

  if (!categories) return notFound();

  return (
    <ProductForm
      categories={categories}
      productId={productId}
      initialData={product}
      pageTitle={pageTitle}
    />
  );
}
