'use client';
import { categories } from '@/data';
import { Order } from '@/services/order/types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import displayPrice from '@/src/lib/price';
import { sentencize } from '@/src/lib/utils';
import Tag from '@/src/components/ui/tag';

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
    accessorKey: 'id',
    header: 'ID'
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
      const statusColor: Record<string, 'yellow' | 'green' | 'red'> = {
        pending: 'yellow',
        booked: 'green',
        cancelled: 'red'
      };
      return (
        <Tag color={statusColor[row.getValue('status') as string]}>
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
  }
];
