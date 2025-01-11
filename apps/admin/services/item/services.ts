import axios from 'axios';
import { createFetcher, ROUTES } from 'services/api';
import { CreateItemPayload, Item, UpdateItemPayload } from './types';

const API_HOST = `${process.env.NEXT_PUBLIC_API}/v1`;

// export type ResponseType<T> = {
//   success: boolean;
//   time: number;
//   message: string;
//   total_products: number;
//   offset: number;
//   limit: number;
//   products: T;
// };

export const fetchAllItems = createFetcher<
  Item[],
  any,
  {
    page: number;
    limit?: number;
    categories?: string | undefined;
    search?: string | undefined;
  }
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
