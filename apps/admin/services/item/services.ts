import { createFetcher, ROUTES } from 'services/api';
import { WithPagination } from 'services/types';
import { CreateItemPayload, Item, UpdateItemPayload } from './types';

export const fetchAllItems = createFetcher<
  WithPagination<{ items: Item[] }>,
  {},
  {}
>({
  url: ROUTES.ITEM.GETALL,
  method: 'GET'
});

export const createItem = createFetcher<
  string,
  CreateItemPayload,
  {
    category_id: string;
  }
>({
  url: ({ category_id }) => ROUTES.ITEM.CREATE({ category_id }),
  method: 'POST'
});

export const updateItem = createFetcher<
  string,
  UpdateItemPayload,
  {
    item_id: string;
  }
>({
  url: ({ item_id }) => ROUTES.ITEM.UPDATE({ item_id }),
  method: 'PUT'
});

export const fetchItem = createFetcher<
  Item,
  {},
  {
    item_id: string;
  }
>({
  url: ({ item_id }) => ROUTES.ITEM.GET({ item_id }),
  method: 'GET'
});

export const deleteItem = createFetcher<
  string,
  {},
  {
    item_id: string;
  }
>({
  url: ({ item_id }) => ROUTES.ITEM.DELETE({ item_id }),
  method: 'DELETE'
});
