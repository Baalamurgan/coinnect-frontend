import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString,
  name: parseAsString,
  email: parseAsString,
  gender: parseAsString,
  category_ids: parseAsArrayOf(parseAsString)
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
