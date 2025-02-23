'use client';

import { searchParams } from '@/src/lib/searchparams';
import { categories } from '@/data';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const CATEGORY_OPTIONS =
  categories?.map((c) => ({
    value: c.id,
    label: c.name
  })) || [];

export function useProductTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [categoryIDsFilter, setCategoriesFilter] = useQueryState(
    'category_ids',
    searchParams.category_ids.withOptions({ shallow: false }).withDefault([])
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setCategoriesFilter(null);

    setPage(1);
  }, [setSearchQuery, setCategoriesFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoryIDsFilter;
  }, [searchQuery, categoryIDsFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    categoryIDsFilter,
    setCategoriesFilter
  };
}
