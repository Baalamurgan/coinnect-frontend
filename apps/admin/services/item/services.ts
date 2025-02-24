import { createFetcher, ROUTES } from '@/services/api';
import { WithPagination } from '@/services/types';
import { CreateItemPayload, Item, UpdateItemPayload } from './types';

const getAll = createFetcher<WithPagination<{ items: Item[] }>, {}, {}>({
  url: ROUTES.ITEM.GETALL,
  method: 'GET'
});

const create = createFetcher<
  string,
  CreateItemPayload,
  {
    category_id: string;
  }
>({
  url: ({ category_id }) => ROUTES.ITEM.CREATE({ category_id }),
  method: 'POST'
});

const update = createFetcher<
  string,
  UpdateItemPayload,
  {
    item_id: string;
  }
>({
  url: ({ item_id }) => ROUTES.ITEM.UPDATE({ item_id }),
  method: 'PUT'
});

const getById = createFetcher<
  Item,
  {},
  {
    item_id: string;
  }
>({
  url: ({ item_id }) => ROUTES.ITEM.GET({ item_id }),
  method: 'GET'
});

const deleteItem = createFetcher<
  string,
  {},
  {
    item_id: string;
  }
>({
  url: ({ item_id }) => ROUTES.ITEM.DELETE({ item_id }),
  method: 'DELETE'
});

export const itemService = {
  getAll,
  create,
  update,
  getById,
  delete: deleteItem
};
