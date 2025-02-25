'use client';

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
import { Input } from '@/src/components/ui/input';
import { Modal } from '@/src/components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const deleteOrderSchema = z.object({
  confirmation: z.string().min(1, 'Please type DELETE to confirm')
});

type DeleteOrderFormValues = z.infer<typeof deleteOrderSchema>;

interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  order: Order;
}

export const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({
  isOpen,
  onClose,
  loading,
  order
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<DeleteOrderFormValues>({
    resolver: zodResolver(deleteOrderSchema),
    defaultValues: { confirmation: '' }
  });

  const onSubmit: SubmitHandler<DeleteOrderFormValues> = async (data) => {
    if (data.confirmation.trim() !== 'DELETE')
      return toast.error("Confirmation required. Please type 'DELETE'.");
    const response = await orderService.delete(
      {},
      {},
      {
        order_id: order.id
      }
    );
    if (response.error) {
      toast.error('Something went wrong. Please try again');
    } else if (response.data) {
      toast.success('Order confirmed');
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
    <Modal title='Delete Order' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='confirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type DELETE to confirm</FormLabel>
                <FormControl>
                  <Input placeholder='DELETE' disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end space-x-2 pt-4'>
            <Button disabled={loading} variant='outline' onClick={onClose}>
              Back
            </Button>
            <Button disabled={loading} type='submit' variant='destructive'>
              Confirm Deletion
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
