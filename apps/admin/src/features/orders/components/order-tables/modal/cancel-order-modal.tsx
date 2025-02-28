'use client';

import { Profile } from '@/services/auth/types';
import { orderService } from '@/services/order/services';
import { Order } from '@/services/order/types';
import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/src/components/ui/form';
import { Modal } from '@/src/components/ui/modal';
import { Textarea } from '@/src/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const cancelOrderSchema = z.object({
  cancellation_reason: z.string().min(1, 'Cancellation reason is required')
});

type CancelOrderFormValues = z.infer<typeof cancelOrderSchema>;

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  order: Order;
  user: Profile | null | undefined;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  loading,
  order,
  user
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<CancelOrderFormValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: { cancellation_reason: '' }
  });

  const onSubmit: SubmitHandler<CancelOrderFormValues> = async (data) => {
    if (!user) return toast.error('Please refresh and try again');
    if (data.cancellation_reason.trim() === '')
      return toast.error('Cancellation reason required.');
    const response = await orderService.cancel(
      {
        user_id: user.id,
        cancellation_reason: data.cancellation_reason
      },
      {},
      {
        order_id: order.id
      }
    );
    if (response.error) {
      toast.error('Something went wrong. Please try again');
    } else if (response.data) {
      toast.success('Order cancelled');
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
    <Modal title='Cancel Order' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='cancellation_reason'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter reason for cancellation'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end space-x-2 pt-4'>
            <Button disabled={loading} variant='outline' onClick={onClose}>
              Back
            </Button>
            <Button disabled={loading} type='submit'>
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
