import { createFetcher, ROUTES } from 'services/api';
import { WithPagination } from 'services/types';

const fetchAllItems = createFetcher<
  WithPagination<{ orders: Order[] }>,
  {},
  {}
>({
  url: ROUTES.ORDER.GETALL,
  method: 'GET'
});
