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
import { Input } from '@/src/components/ui/input';
import { Modal } from '@/src/components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const restoreOrderSchema = z.object({
  confirmation: z.string().min(1, 'Please type RESTORE to confirm')
});

type RestoreOrderFormValues = z.infer<typeof restoreOrderSchema>;

interface RestoreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export const RestoreOrderModal: React.FC<RestoreOrderModalProps> = ({
  isOpen,
  onClose,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<RestoreOrderFormValues>({
    resolver: zodResolver(restoreOrderSchema),
    defaultValues: { confirmation: '' }
  });

  const onSubmit: SubmitHandler<RestoreOrderFormValues> = async (data) => {
    console.log(data);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title='Restore Order' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='confirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type RESTORE to confirm</FormLabel>
                <FormControl>
                  <Input placeholder='RESTORE' disabled={loading} {...field} />
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
              Confirm Restore
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
