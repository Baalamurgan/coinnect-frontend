'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';

const deliverySchema = z.object({
  delivery_name: z.string().min(1, 'Delivery person name is required'),
  delivery_ID: z.string().min(1, 'Delivery ID is required'),
  delivery_date: z.date()
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

interface MarkAsDeliveredModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export const MarkAsDeliveredModal: React.FC<MarkAsDeliveredModalProps> = ({
  isOpen,
  onClose,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      delivery_name: '',
      delivery_ID: '',
      delivery_date: new Date()
    }
  });

  const onSubmit: SubmitHandler<DeliveryFormValues> = async (data) => {
    console.log(data);
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
            name='delivery_name'
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
            name='delivery_ID'
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
