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

const deleteOrder = createFetcher<
  string,
  {},
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.DELETE({ order_id }),
  method: 'DELETE'
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

const markAsPaid = createFetcher<
  string,
  {
    user_id: string;
    billable_amount_paid: number;
  },
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.PAY({ order_id }),
  method: 'PATCH'
});

export const orderService = {
  getAll,
  getById,
  delete: deleteOrder,
  confirm,
  markAsPaid
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
