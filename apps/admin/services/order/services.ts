import { createFetcher, ROUTES } from '../api';
import { WithPagination } from '../types';
import { Order } from './types';

const getAll = createFetcher<WithPagination<{ orders: Order[] }>, {}, {}>({
  url: ROUTES.ORDER.GETALL,
  method: 'GET'
});

const getById = createFetcher<
  Order,
  unknown,
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.GETBYID({ order_id }),
  method: 'GET'
});

const confirm = createFetcher<
  string,
  {
    user_id: string;
  },
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.CONFIRM({ order_id }),
  method: 'POST'
});

export const orderService = {
  getAll,
  getById,
  confirm
};

// import { createFetcher, ROUTES } from '@/services/api';
// import { WithPagination } from '@/services/types';
// import { Order } from './types';

// export const orderService = {
//   getAll
//   // createItem,
//   // updateItem,
//   // fetchItem,
//   // deleteItem
// };
