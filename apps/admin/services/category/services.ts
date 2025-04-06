import axios from 'axios';
import { createFetcher, ROUTES } from '../api';
import { Category } from '../item/types';
import { WithPagination } from '../types';
import { UpdateCategoryPayload } from './types';

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

const getById = createFetcher<
  Category,
  {},
  {
    category_id: string;
  }
>({
  url: ({ category_id }) => ROUTES.CATEGORY.GETBYID({ category_id }),
  method: 'GET'
});

const update = createFetcher<
  string,
  UpdateCategoryPayload,
  {
    category_id: string;
  }
>({
  url: ({ category_id }) => ROUTES.CATEGORY.UPDATE({ category_id }),
  method: 'PUT'
});

const deleteCategory = createFetcher<
  string,
  unknown,
  {
    category_id: string;
  }
>({
  url: ({ category_id }) => ROUTES.CATEGORY.DELETE({ category_id }),
  method: 'DELETE'
});

const sync = () => axios.post('/api/admin/revalidate-categories');

export const categoryService = {
  create,
  getAll,
  getById,
  update,
  delete: deleteCategory,
  sync
};
