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
  method: 'PUT'
});

const cancel = createFetcher<
  string,
  {
    user_id: string;
    cancellation_reason: string;
  },
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.CANCEL({ order_id }),
  method: 'PATCH'
});

const restore = createFetcher<
  string,
  {
    user_id: string;
  },
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.RESTORE({ order_id }),
  method: 'PATCH'
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

const markAsShipped = createFetcher<
  string,
  {
    user_id: string;
    shipping_name: string;
    shipping_id: string;
    shipping_date: number;
  },
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.SHIP({ order_id }),
  method: 'PATCH'
});

const markAsDelivered = createFetcher<
  string,
  {
    user_id: string;
    delivery_person_name: string;
    delivery_id: string;
    delivery_date: number;
  },
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.DELIVER({ order_id }),
  method: 'PATCH'
});

export const orderService = {
  getAll,
  getById,
  delete: deleteOrder,
  confirm,
  cancel,
  restore,
  markAsPaid,
  markAsShipped,
  markAsDelivered
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
