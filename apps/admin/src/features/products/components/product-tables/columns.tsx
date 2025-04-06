'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Category, Item } from '@/services/item/types';
import { CellAction } from './cell-action';

export const getColumns = (categories: Category[]): ColumnDef<Item>[] => [
  {
    accessorKey: 'image_url',
    header: 'IMAGE',
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square'>
          <Image
            src={row.getValue('image_url')}
            alt={row.getValue('name')}
            fill
            className='rounded-lg'
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'category_id',
    header: 'CATEGORY ID',
    enableHiding: true
  },
  {
    accessorKey: 'gst',
    header: 'GST',
    enableHiding: true
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY',
    cell: ({ row }) => {
      return (
        <div>
          <p>
            {categories.find((i) => i.id === row.getValue('category_id'))?.name}
          </p>
        </div>
      );
    }
  },
  {
    accessorKey: 'price',
    header: 'PRICE',
    cell: ({ row }) => {
      return (
        <p>
          ₹{row.getValue('price')} + {row.getValue('gst')}% GST
        </p>
      );
    }
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
