import { notFound } from 'next/navigation';
import { fetchItem } from 'services/item/services';
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
    const response = await fetchItem(
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

  return (
    <ProductForm
      productId={productId}
      initialData={product}
      pageTitle={pageTitle}
    />
  );
}
