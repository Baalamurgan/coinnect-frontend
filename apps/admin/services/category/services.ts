import { createFetcher, ROUTES } from '../api';
import { Category } from '../item/types';
import { WithPagination } from '../types';

const create = createFetcher<
  Category,
  {
    name: string;
    description: string;
    parent_category_id: string;
  },
  unknown
>({
  url: ROUTES.CATEGORY.CREATE,
  method: 'POST'
});

const getAll = createFetcher<
  WithPagination<{ categories: Category[] }>,
  unknown,
  unknown
>({
  url: ROUTES.CATEGORY.GETALL,
  method: 'GET'
});

export const categoryService = {
  create,
  getAll
};
