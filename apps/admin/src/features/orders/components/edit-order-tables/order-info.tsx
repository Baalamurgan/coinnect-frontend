import { orderService } from '@/services/order/services';
import { Order } from '@/services/order/types';
import { Button } from '@/src/components/ui/button';
import { Form } from '@/src/components/ui/form';
import displayPrice from '@/src/lib/price';
import { sentencize } from '@/src/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import OrderItem from './order-item';

const formSchema = z.object({
  order: z.object({
    order_items: z.array(
      z.object({
        id: z.string(),
        quantity: z.string(),
        price_per_item: z.string(),
        total_price: z.string()
      })
    ),
    total_price: z.number().positive()
  })
});

type OrderDetails = z.infer<typeof formSchema>;

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
  const { push, back } = useRouter();
  const [error, setError] = useState(false);
  const defaultValues = {
    order: {
      order_items: order.order_items.map((o) => ({
        id: o.id,
        quantity: o.quantity.toString(),
        price_per_item: (o.billable_amount / o.quantity).toString(),
        total_price: o.billable_amount.toString()
      })),
      total_price: order.billable_amount
    }
  };

  const form = useForm<OrderDetails>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit: SubmitHandler<OrderDetails> = async (data) => {
    console.log(data);
    const response = await orderService.edit(
      {
        order_items: data.order.order_items.map((o) => ({
          order_item_id: o.id,
          price_per_item: Number(o.price_per_item),
          quantity: Number(o.quantity)
        }))
      },
      {},
      {
        order_id: order.id
      }
    );
    if (response.error) {
      toast.error(
        sentencize(response.error.response?.data.message) ||
          'Something went wrong. Please try again'
      );
    } else if (response.data) {
      toast.success('Order edited successfully');
      push(`/dashboard/orders`);
    }
  };

  const onError: SubmitErrorHandler<OrderDetails> = (errors) =>
    console.log(errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className='rounded-lg xl:col-span-2'>
          <table className='w-full'>
            <thead>
              <tr className='border-b text-gray-400'>
                <th className='pb-2 text-left'>PRODUCT</th>
                <th className='px-5'>PRICE</th>
                <th className='px-5'>QUANTITY</th>
                <th className='px-5'>TOTAL</th>
                <th className='px-5'></th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((order_item, index) => (
                <OrderItem
                  key={order_item.id}
                  order={order}
                  order_item={order_item}
                  form={form}
                  index={index}
                  removeItemFromOrderHandler={removeItemFromOrderHandler}
                  setError={setError}
                />
              ))}
              <tr className='border-b'>
                <td className='flex items-center gap-4 py-4'>
                  <p className='text-xl'>Total</p>
                </td>
                <td></td>
                <td></td>
                <td className='text-center text-lg'>
                  {displayPrice({
                    price: Number(form.watch('order.total_price')) || 0
                  })}
                </td>
              </tr>
              {order.billable_amount_paid > 0 && (
                <tr className='border-b'>
                  <td className='flex items-center gap-4 py-4'>
                    <div className='flex items-center gap-x-1'>
                      <p className='text-xl'>Amount Paid</p>
                      {order.status !== 'pending' && (
                        <CheckCircleIcon className='h-6 w-6 text-green-500' />
                      )}
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td className='text-center text-lg'>
                    <div className='group relative flex h-full items-center justify-center'>
                      <p>
                        {displayPrice({ price: order.billable_amount_paid })}
                      </p>
                      <div className='absolute -right-2'>
                        <CheckCircleIcon className='h-4 w-4 text-green-500' />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className='mt-3 text-sm'>
          <span className='text-base font-semibold'>NOTE:</span> GST will be
          applied after saving changes. The current amount displayed is
          exclusive of GST.
        </p>
        <div className='mt-10 flex items-center justify-between gap-x-20'>
          <Button
            aria-label='Cancel'
            variant='outline'
            type='button'
            onClick={back}
          >
            Cancel
          </Button>
          <div className='flex items-center space-x-10'>
            <Button
              aria-label='Reset'
              variant='ghost'
              type='button'
              onClick={() => form.reset(defaultValues)}
            >
              Reset
            </Button>
            <Button aria-label='Save' type='submit'>
              Save changes
            </Button>
          </div>
        </div>
      </form>
      <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
    </Form>
  );
};

export default OrderInfo;
