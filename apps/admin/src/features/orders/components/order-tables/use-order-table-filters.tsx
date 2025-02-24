'use client';

import { searchParams } from '@/src/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const STATUS_OPTIONS = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'yellow'
  },
  {
    value: 'booked',
    label: 'Booked',
    color: 'green'
  },
  {
    value: 'paid',
    label: 'Paid',
    color: 'blue'
  },
  {
    value: 'shipped',
    label: 'Shipped',
    color: 'blue'
  },
  {
    value: 'delivered',
    label: 'Delivered',
    color: 'green'
  },
  {
    value: 'cancelled',
    label: 'Cancelled'
  }
];

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

  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    searchParams.status.withOptions({ shallow: false }).withDefault([])
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setNameQuery(null);
    setEmailQuery(null);
    setPage(1);
    setStatusFilter(null);
  }, [setNameQuery, setEmailQuery, setPage, setStatusFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!nameQuery || !!emailQuery || !!statusFilter;
  }, [nameQuery, emailQuery]);

  return {
    nameQuery,
    setNameQuery,
    statusFilter,
    setStatusFilter,
    emailQuery,
    setEmailQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
