'use client';

import { searchParams } from '@/lib/searchparams';
import { categories } from 'data';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const CATEGORY_OPTIONS =
  categories?.map((c) => ({
    value: c.id,
    label: c.name
  })) || [];

export function useOrderTableFilters() {
  const [nameQuery, setNameQuery] = useQueryState(
    'name',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [emailQuery, setEmailQuery] = useQueryState(
    'email',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setNameQuery(null);
    setEmailQuery(null);
    setPage(1);
  }, [setNameQuery, setEmailQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!nameQuery || !!emailQuery;
  }, [nameQuery, emailQuery]);

  return {
    nameQuery,
    setNameQuery,
    emailQuery,
    setEmailQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
