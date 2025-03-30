'use client';
import { Order } from '@/services/order/types';
import Tag from '@/src/components/ui/tag';
import { isOrderRecent } from '@/src/lib/order';
import displayPrice from '@/src/lib/price';
import { sentencize } from '@/src/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { CellAction } from './cell-action';
import { STATUS_OPTIONS } from './use-order-table-filters';

export const columns: ColumnDef<Order>[] = [
  // {
  //   accessorKey: 'image_url',
  //   header: 'IMAGE',
  //   cell: ({ row }) => {
  //     return (
  //       <div className='relative aspect-square'>
  //         <Image
  //           src={row.getValue('image_url')}
  //           alt={row.getValue('name')}
  //           fill
  //           className='rounded-lg'
  //         />
  //       </div>
  //     );
  //   }
  // },
  {
    accessorKey: 'updated_at',
    header: 'UPDATED AT'
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const { push } = useRouter();
      return (
        <div
          className='flex cursor-pointer items-center gap-x-2 hover:text-blue-400 hover:underline'
          onClick={() => push(`/dashboard/orders/${row.getValue('id')}`)}
        >
          <p>{row.getValue('id')}</p>
          {isOrderRecent(row.getValue('updated_at')) && (
            <div className='h-3 w-3 animate-pulse rounded-full bg-[#e3753e]' />
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'user_id',
    header: 'USER ID',
    enableHiding: true
  },
  {
    accessorKey: 'billable_amount_paid',
    header: 'BILLABLE AMOUNT PAID',
    enableHiding: true
  },
  // {
  //   accessorKey: 'category',
  //   header: 'CATEGORY',
  //   cell: ({ row }) => {
  //     return (
  //       <div>
  //         <p>
  //           {categories.find((i) => i.id === row.getValue('category_id'))?.name}
  //         </p>
  //       </div>
  //     );
  //   }
  // },
  {
    accessorKey: 'billable_amount',
    header: 'PRICE',
    cell: ({ row }) => {
      return <p>{displayPrice({ price: row.getValue('billable_amount') })}</p>;
    }
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      return (
        <Tag
          color={
            STATUS_OPTIONS.find(
              (s) => s.value === (row.getValue('status') as string)
            )?.color
          }
        >
          {sentencize(row.getValue('status'))}
        </Tag>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: 'CREATED AT',
    cell: ({ row }) => (
      <div>
        <p className='text-sm font-semibold'>
          {new Date(Number(row.getValue('created_at')) * 1000).toLocaleString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }
          )}
        </p>
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
