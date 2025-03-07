import { Order } from '@/services/order/types';
import displayPrice from '@/src/lib/price';
import { CheckCircleIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const OrderInfo = ({
  order,
  removeItemFromOrderHandler
}: {
  order: Order;
  removeItemFromOrderHandler: (p: {
    order_id: string;
    order_item_id: string;
  }) => void;
}) => {
  return (
    <div className='rounded-lg xl:col-span-2'>
      <table className='w-full'>
        <thead>
          <tr className='border-b text-gray-200'>
            <th className='pb-2 text-left'>PRODUCT</th>
            <th className='px-5'>PRICE</th>
            <th className='px-5'>QUANTITY</th>
            <th className='px-5'>TOTAL</th>
            <th className='px-5'></th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item) => (
            <tr key={item.id} className='border-b'>
              <td className='flex items-center gap-4 py-4'>
                {item.metadata?.image_url ? (
                  <Image
                    src={item.metadata.image_url}
                    alt={item.item_id}
                    width={100}
                    height={50}
                    className='rounded-lg'
                  />
                ) : null}
                <div>
                  <p className='text-base'>{item.metadata?.name}</p>
                </div>
              </td>
              <td className='text-center font-medium'>
                {displayPrice({ price: item.billable_amount })}
              </td>
              <td className='px-5 text-center'>
                <div className='flex items-center justify-center gap-x-2 rounded-md border bg-gray-800 py-1'>
                  {/* <button
                      className="text-lg font-bold"
                      onClick={() => handleQuantityChange(item.id, "decrease")}
                    >
                      -
                    </button> */}
                  <span>{item.quantity}</span>
                  {/* <button
                      className="text-lg font-bold"
                      onClick={() => handleQuantityChange(item.id, "increase")}
                    >
                      +
                    </button> */}
                </div>
              </td>
              <td className='text-center font-medium'>
                {displayPrice({
                  price: item.billable_amount * item.quantity
                })}
              </td>
              <td className='px-5 text-center'>
                {order.status === 'pending' && (
                  <button
                    type='button'
                    onClick={() =>
                      removeItemFromOrderHandler({
                        order_id: order.id,
                        order_item_id: item.id
                      })
                    }
                  >
                    <TrashIcon className='h-6 w-6 cursor-pointer text-red-500 hover:text-red-600' />
                  </button>
                )}
              </td>
            </tr>
          ))}
          <tr className='border-b'>
            <td className='flex items-center gap-4 py-4'>
              <p className='text-lg'>Total</p>
            </td>
            <td></td>
            <td></td>
            <td className='text-center text-lg'>
              {displayPrice({
                price: order.billable_amount
              })}
            </td>
          </tr>
          {order.billable_amount_paid > 0 && (
            <tr>
              <td>Amount Paid</td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <div className='flex items-center gap-x-1'>
                  <p>{displayPrice({ price: order.billable_amount_paid })}</p>
                  {order.status !== 'pending' && (
                    <CheckCircleIcon className='h-6 w-6 text-green-500' />
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderInfo;
