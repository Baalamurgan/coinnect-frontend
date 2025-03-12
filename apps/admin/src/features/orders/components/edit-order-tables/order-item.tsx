'use client';

import { itemService } from '@/services/item/services';
import { Item } from '@/services/item/types';
import { Order, OrderItem as OrderItemType } from '@/services/order/types';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { TrashIcon, TriangleAlertIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

const OrderItem = ({
  order,
  order_item,
  form,
  index,
  removeItemFromOrderHandler,
  setError
}: {
  order: Order;
  order_item: OrderItemType;
  form: UseFormReturn<
    {
      order: {
        order_items: {
          id: string;
          quantity: string;
          price_per_item: string;
          total_price: string;
        }[];
        total_price: number;
      };
    },
    any,
    undefined
  >;
  index: number;
  removeItemFromOrderHandler: (p: {
    order_id: string;
    order_item_id: string;
  }) => void;
  setError: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<Item | null | undefined>();

  const quantity = Number(form.watch(`order.order_items.${index}.quantity`));
  const pricePerItem = Number(
    form.watch(`order.order_items.${index}.price_per_item`)
  );

  const calculateOrderTotalPrice = () => {
    return form
      .getValues()
      .order.order_items.reduce(
        (sum, item) => sum + Number(item.total_price),
        0
      );
  };

  useEffect(() => {
    if (pricePerItem && quantity > 0) {
      const newTotalPrice = pricePerItem * quantity;
      form.setValue(
        `order.order_items.${index}.total_price`,
        newTotalPrice.toString(),
        {
          shouldValidate: true
        }
      );
      form.setValue('order.total_price', calculateOrderTotalPrice());
    }
  }, [pricePerItem, quantity]);

  const fetchItemDetails = async (item_id: string) => {
    setLoading(true);
    const response = await itemService.getById(
      {},
      {},
      {
        item_id
      }
    );
    if (response.error || !response.data) setItem(null);
    else if (response.data) {
      setItem(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!item) fetchItemDetails(order_item.item_id);
  }, [quantity]);

  useEffect(() => {
    if (item?.stock === 0) setError(true);
    else setError(false);
  }, [item]);

  return (
    <tr className='border-b'>
      <td className='w-fit'>
        <Link
          href={`/dashboard/products/${order_item.item_id}`}
          className='group flex items-center gap-4 py-4'
        >
          {order_item.metadata?.image_url ? (
            <Image
              src={order_item.metadata.image_url}
              alt={order_item.item_id}
              width={100}
              height={50}
              className='rounded-lg group-hover:scale-105'
            />
          ) : null}
          <div className='group-hover:underline'>
            <p className='text-base'>{order_item.metadata?.name}</p>
          </div>
        </Link>
      </td>
      <td className='text-center font-medium'>
        <FormField
          control={form.control}
          name={`order.order_items.${index}.price_per_item`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Enter the price per item'
                  disabled={loading}
                  className='w-full'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </td>
      <td
        className='px-5 text-center'
        style={{
          // @ts-ignore
          textAlign: '-webkit-center'
        }}
      >
        <div className='flex max-w-[80px] items-center justify-center gap-x-2 rounded-md border bg-gray-800'>
          <FormField
            control={form.control}
            name={`order.order_items.${index}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter the quantity'
                    disabled={loading}
                    min={1}
                    max={order_item.quantity + (item?.stock || 0)}
                    className='w-full'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {order_item.quantity !== quantity ? (
          <div className='flex flex-col gap-y-1'>
            <p className='mt-1 whitespace-nowrap text-sm text-gray-500'>
              Current quantity: {order_item.quantity}
            </p>
            <p className='mt-1 whitespace-nowrap text-sm text-gray-500'>
              In stock: {item?.stock}
            </p>
          </div>
        ) : (
          item?.stock === 0 && (
            <div className='mt-1 flex items-center gap-x-1 text-yellow-500'>
              <TriangleAlertIcon className='h-4 w-4' />
              <p className='whitespace-nowrap text-sm text-yellow-500'>
                Out of stock.
              </p>
            </div>
          )
        )}
      </td>
      <td className='text-center font-medium'>
        <FormField
          control={form.control}
          name={`order.order_items.${index}.total_price`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Enter the total price'
                  disabled={true}
                  className='w-full'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </td>
      <td className='px-5 text-center'>
        {order.status === 'pending' && (
          <button
            type='button'
            onClick={() =>
              removeItemFromOrderHandler({
                order_id: order.id,
                order_item_id: order_item.id
              })
            }
          >
            <TrashIcon className='h-6 w-6 cursor-pointer text-red-500 hover:text-red-600' />
          </button>
        )}
      </td>
    </tr>
  );
};

export default OrderItem;
