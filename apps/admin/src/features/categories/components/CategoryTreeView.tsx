'use client';

import { categoryService } from '@/services/category/services';
import { Category } from '@/services/item/types';
import Loader from '@/src/components/Loader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Tree, { RawNodeDatum } from 'react-d3-tree';
import { NewCategoryModal } from '../modal/new-category-modal';

export type RawNodeDatumWithID = {
  id: string;
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatumWithID[];
};
export default function CategoryTreeView() {
  const searchParams = useSearchParams();
  const newCategoryModal = searchParams.get('is_new_category_modal');
  const { back } = useRouter();

  const [categories, setCategories] = useState<Category[] | undefined>();

  const getSubCategories = (category: Category): RawNodeDatumWithID => {
    const subCategory = categories?.filter(
      (c) => c.parent_category_id && c.parent_category_id === category.id
    );
    return {
      id: category.id,
      name: category.name,
      children:
        !subCategory || subCategory.length === 0
          ? []
          : subCategory.map((childC) => getSubCategories(childC))
    };
  };

  const categoryChartData: RawNodeDatumWithID | null = useMemo(() => {
    if (!categories) return null;
    return {
      name: 'Categories',
      id: '',
      children: categories
        .filter((c) => !c.parent_category_id)
        .map((c) => getSubCategories(c))
    };
  }, [categories]);

  const fetchCategories = useCallback(async () => {
    const response = await categoryService.getAll();
    if (response.error) {
      setCategories([]);
    } else if (response.data) {
      setCategories(response.data.categories);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!categories || !categoryChartData) return <Loader />;

  return (
    <div id='treeWrapper' className='h-full w-full'>
      <Tree
        data={categoryChartData}
        svgClassName='bg-white'
        translate={{
          x: 600,
          y: 100
        }}
        hasInteractiveNodes
        enableLegacyTransitions
        orientation='vertical'
        nodeSize={{
          x: 200,
          y: 250
        }}
        initialDepth={1}
      />
      {newCategoryModal === 'true' && (
        <NewCategoryModal
          isOpen
          onClose={async () => {
            await fetchCategories();
            back();
          }}
          categoryChartData={categoryChartData}
        />
      )}
    </div>
  );
}
