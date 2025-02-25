import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  createParser,
  inferParserType
} from 'nuqs/server';
import { ModalTypes } from '../features/orders/components/order-tables/cell-action';

const parseAsModalType = createParser<ModalTypes>({
  parse: (value) => {
    const validTypes: ModalTypes[] = [
      'confirm',
      'mark_as_paid',
      'mark_as_shipped',
      'mark_as_delivered',
      'cancel',
      'restore',
      'delete'
    ];
    return validTypes.includes(value as ModalTypes)
      ? (value as ModalTypes)
      : null;
  },
  serialize: (value) => value // Simply return the string value
});

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  name: parseAsString,
  email: parseAsString,
  gender: parseAsString,
  status: parseAsArrayOf(parseAsString),
  category_ids: parseAsArrayOf(parseAsString),
  modalQuery: parseAsModalType,
  order_id: parseAsString
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
