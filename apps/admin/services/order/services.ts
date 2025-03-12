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

const edit = createFetcher<
  string,
  {
    order_items: {
      order_item_id: string;
      quantity: number;
      price_per_item: number;
    }[];
  },
  {
    order_id: string;
  }
>({
  url: ({ order_id }) => ROUTES.ORDER.EDIT({ order_id }),
  method: 'PATCH'
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
  method: 'PATCH'
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

const removeItem = createFetcher<
  string,
  unknown,
  {
    order_id: string;
    order_item_id: string;
  }
>({
  url: (p: { order_id: string; order_item_id: string }) =>
    ROUTES.ORDER.ITEM.REMOVE(p),
  method: 'DELETE'
});

export const orderService = {
  getAll,
  getById,
  edit,
  delete: deleteOrder,
  confirm,
  cancel,
  restore,
  markAsPaid,
  markAsShipped,
  markAsDelivered,
  removeItem
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
