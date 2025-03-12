'use client';

import { DataTableFilterBox } from '@/src/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/src/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/src/components/ui/table/data-table-search';
import {
  CATEGORY_OPTIONS,
  useProductTableFilters
} from './use-product-table-filters';

export default function ProductTableAction() {
  const {
    categoryIDsFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useProductTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='name'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='categories'
        title='Categories'
        options={CATEGORY_OPTIONS}
        setFilterValue={setCategoriesFilter}
        filterValue={categoryIDsFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
