'use client';

import { categoryService } from '@/services/category/services';
import { Category } from '@/services/item/types';
import Loader from '@/src/components/Loader';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tree, TreeApi } from 'react-arborist';
import { NewCategoryModal } from '../modal/new-category-modal';

export type TreeData = {
  id: string;
  name: string;
  parentCount?: number;
  children?: TreeData[];
};

const CategoryTreeView = () => {
  const searchParams = useSearchParams();
  const newCategoryModal = searchParams.get('is_new_category_modal');
  const category_id = searchParams.get('category_id');
  const isDeleteCategory = searchParams.get('is_delete_category');

  const { push, back } = useRouter();

  const [categories, setCategories] = useState<Category[] | undefined>();

  const getSubCategories = (
    category: Category,
    parent?: Category
  ): TreeData => {
    const subCategory = categories?.filter(
      (c) => c.parent_category_id && c.parent_category_id === category.id
    );
    return {
      id: category.id,
      name: category.name,
      parentCount: 0,
      children:
        !subCategory || subCategory.length === 0
          ? []
          : subCategory.map((childC) => getSubCategories(childC, category))
    };
  };

  const categoryChartData: TreeData | null = useMemo(() => {
    if (!categories) return null;
    return {
      name: 'Categories',
      id: '1',
      parentCount: 0,
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

  const [tree, setTree] = useState<TreeApi<TreeData> | null | undefined>(null);
  const [active, setActive] = useState<TreeData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [count, setCount] = useState(0);
  const [followsFocus, setFollowsFocus] = useState(false);

  useEffect(() => {
    setCount(tree?.visibleNodes.length ?? 0);
  }, [tree, searchTerm]);

  if (!categories || !categoryChartData) return <Loader />;

  return (
    <div>
      <Tree
        data={[categoryChartData]}
        ref={(t) => setTree(t)}
        width={'100%'}
        indent={40}
        disableMultiSelection
        rowClassName={clsx(
          'cursor-pointer !w-fit hover:bg-blue-800 hover:pr-10 hover:rounded-md hover:border hover:border-white'
        )}
        onSelect={(e) => {
          e[0]?.id &&
            push(
              `/dashboard/categories?is_new_category_modal=true&category_id=${e[0].id}`
            );
        }}
        disableDrag
        disableEdit
        disableDrop
        padding={15}
        rowHeight={30}
        searchTerm={searchTerm}
        selectionFollowsFocus={followsFocus}
        selection={active?.id}
        onActivate={(node) => setActive(node.data)}
      />
      {newCategoryModal === 'true' && (
        <NewCategoryModal
          isOpen
          onClose={async () => {
            await fetchCategories();
            back();
          }}
          category_id={category_id}
          isDeleteCategory={isDeleteCategory}
          categoryChartData={categoryChartData}
        />
      )}
    </div>
  );
};

export default CategoryTreeView;
