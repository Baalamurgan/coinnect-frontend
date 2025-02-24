'use client';

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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const markAsPaidSchema = z.object({
  amountPaid: z.number().min(1, 'Amount must be greater than zero')
});

type MarkAsPaidFormValues = z.infer<typeof markAsPaidSchema>;

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: MarkAsPaidFormValues) => void;
  loading: boolean;
  order: Order;
}

export const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  order
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const form = useForm<MarkAsPaidFormValues>({
    resolver: zodResolver(markAsPaidSchema),
    defaultValues: { amountPaid: order.billable_amount }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title='Mark as Paid' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onConfirm)} className='space-y-4'>
          <FormField
            control={form.control}
            name='amountPaid'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter amount'
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
              Confirm Payment
            </Button>
          </div>
        </form>
      </Form>
      <div className='mt-4 text-center'>
        <p className='text-sm text-muted-foreground'>
          Need to update item prices or quantities?
        </p>
        <Button
          variant='secondary'
          className='mt-2 w-full'
          onClick={() => router.push('/update-order')}
        >
          Modify Order Before Payment
        </Button>
      </div>
    </Modal>
  );
};
