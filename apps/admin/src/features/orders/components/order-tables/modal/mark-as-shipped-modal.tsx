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
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const shippingSchema = z.object({
  shipping_name: z.string().min(1, 'Shipping name is required'),
  shipping_ID: z.string().min(1, 'Shipping ID is required'),
  shipping_date: z.date()
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

interface MarkAsShippedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ShippingFormValues) => void;
  loading: boolean;
}

export const MarkAsShippedModal: React.FC<MarkAsShippedModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shipping_name: '',
      shipping_ID: '',
      shipping_date: new Date()
    }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title='Mark as Shipped' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onConfirm)} className='space-y-4'>
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
            name='shipping_ID'
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
