'use client';

import { DataTableResetFilter } from '@/src/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/src/components/ui/table/data-table-search';
import {
  STATUS_OPTIONS,
  useOrderTableFilters
} from './use-order-table-filters';
import { DataTableFilterBox } from '@/src/components/ui/table/data-table-filter-box';

export default function OrderTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    usernameQuery,
    setUsernameQuery,
    emailQuery,
    setEmailQuery,
    statusFilter,
    setStatusFilter
  } = useOrderTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='username'
        searchQuery={usernameQuery}
        setSearchQuery={setUsernameQuery}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='email'
        searchQuery={emailQuery}
        setSearchQuery={setEmailQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='status'
        title='Status'
        options={STATUS_OPTIONS}
        setFilterValue={setStatusFilter}
        filterValue={statusFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
