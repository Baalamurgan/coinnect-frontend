import { createFetcher, ROUTES } from 'services/api';
import { WithPagination } from 'services/types';
import { Order } from './types';

const fetchAllItems = createFetcher<
  WithPagination<{ orders: Order[] }>,
  {},
  {}
>({
  url: ROUTES.ORDER.GETALL,
  method: 'GET'
});

export const orderService = {
  fetchAllItems
  // createItem,
  // updateItem,
  // fetchItem,
  // deleteItem
};
