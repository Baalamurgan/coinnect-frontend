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

const deliverySchema = z.object({
  delivery_person_name: z.string(),
  delivery_id: z.string(),
  delivery_date: z.date()
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

interface MarkAsDeliveredModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  order: Order;
  user: Profile | null | undefined;
}

export const MarkAsDeliveredModal: React.FC<MarkAsDeliveredModalProps> = ({
  isOpen,
  onClose,
  loading,
  order,
  user
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      delivery_person_name: '',
      delivery_id: '',
      delivery_date: new Date()
    }
  });

  const onSubmit: SubmitHandler<DeliveryFormValues> = async (data) => {
    if (!user) return toast.error('Please refresh and try again');
    const response = await orderService.markAsDelivered(
      {
        user_id: user.id,
        delivery_date: toEpoch(data.delivery_date),
        delivery_id: data.delivery_id,
        delivery_person_name: data.delivery_person_name
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
    <Modal title='Mark as Delivered ✅' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='delivery_person_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Person</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter delivery person name'
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
            name='delivery_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter delivery ID'
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
            name='delivery_date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Date</FormLabel>
                <FormControl>
                  <DatePicker
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
