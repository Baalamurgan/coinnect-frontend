'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useOrderTableFilters } from './use-order-table-filters';

export default function OrderTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    nameQuery,
    setNameQuery,
    emailQuery,
    setEmailQuery
  } = useOrderTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='name'
        searchQuery={nameQuery}
        setSearchQuery={setNameQuery}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='email'
        searchQuery={emailQuery}
        setSearchQuery={setEmailQuery}
        setPage={setPage}
      />
      {/* <DataTableFilterBox
        filterKey='categories'
        title='Categories'
        options={CATEGORY_OPTIONS}
        setFilterValue={setCategoriesFilter}
        filterValue={categoryIDsFilter}
      /> */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
