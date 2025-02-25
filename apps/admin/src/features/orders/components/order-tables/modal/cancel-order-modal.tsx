'use client';

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
import * as z from 'zod';

const cancelOrderSchema = z.object({
  cancel_reason: z.string().min(1, 'Cancellation reason is required')
});

type CancelOrderFormValues = z.infer<typeof cancelOrderSchema>;

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<CancelOrderFormValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: { cancel_reason: '' }
  });

  const onSubmit: SubmitHandler<CancelOrderFormValues> = async (data) => {
    console.log(data);
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
            name='cancel_reason'
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
