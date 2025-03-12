'use client';

import { Profile } from '@/services/auth/types';
import { orderService } from '@/services/order/services';
import { Order } from '@/services/order/types';
import { Button } from '@/src/components/ui/button';
import { DatePicker } from '@/src/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Modal } from '@/src/components/ui/modal';
import { toEpoch } from '@/src/lib/epoch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const shippingSchema = z.object({
  shipping_name: z.string(),
  shipping_id: z.string(),
  shipping_date: z.date()
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

interface MarkAsShippedModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  order: Order;
  user: Profile | null | undefined;
}

export const MarkAsShippedModal: React.FC<MarkAsShippedModalProps> = ({
  isOpen,
  onClose,
  loading,
  order,
  user
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shipping_name: '',
      shipping_id: '',
      shipping_date: new Date()
    }
  });

  const onSubmit: SubmitHandler<ShippingFormValues> = async (data) => {
    if (!user) return toast.error('Please refresh and try again');
    const response = await orderService.markAsShipped(
      {
        user_id: user.id,
        shipping_date: toEpoch(data.shipping_date),
        shipping_id: data.shipping_id,
        shipping_name: data.shipping_name
      },
      {},
      {
        order_id: order.id
      }
    );
    if (response.error) {
      return toast.error('Something went wrong. Please refresh and try again');
    } else if (response.data) {
      toast.success('Order marked as shipped');
      onClose();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title='Mark as Shipped' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='shipping_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter shipping name'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='shipping_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter shipping ID'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='shipping_date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Date</FormLabel>
                <FormControl>
                  <DatePicker
                    mode='single'
                    captionLayout='dropdown-years'
                    date={field.value}
                    onDateChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end space-x-2 pt-4'>
            <Button disabled={loading} variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={loading} type='submit'>
              Confirm
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
