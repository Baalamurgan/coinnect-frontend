'use client';

import { authService } from '@/services/auth/service';
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
import { Input } from '@/src/components/ui/input';
import { Modal } from '@/src/components/ui/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const confirmOrderSchema = z.object({
  confirmation: z.string().min(1, 'Please type CONFIRM to proceed'),
  // .refine((val) => val === 'confirm', {
  //   message: "Confirmation must be 'confirm'"
  // }),
  username: z.string().min(1, {
    message: 'Required'
  }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  phone: z
    .string()
    .min(1, { message: 'Enter a valid phone number' })
    .max(10, { message: 'Enter a valid phone number' })
});

type ConfirmOrderFormValues = z.infer<typeof confirmOrderSchema>;

interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  order: Order;
  user: Profile | null | undefined;
  setUser: Dispatch<SetStateAction<Profile | null | undefined>>;
}

export const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isOpen,
  onClose,
  loading,
  order,
  user,
  setUser
}) => {
  const { push } = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const defaultValues = {
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    confirmation: ''
  };

  const form = useForm<ConfirmOrderFormValues>({
    resolver: zodResolver(confirmOrderSchema),
    defaultValues
  });

  const onSubmit: SubmitHandler<ConfirmOrderFormValues> = async (data) => {
    if (data.confirmation.trim() !== 'CONFIRM')
      return toast.error("Confirmation required. Please type 'confirm'.");
    let user_id = user?.id || null;
    if (!user) {
      const response = await authService.signup({
        email: data.email,
        password: 'New@1234',
        username: data.username
      });
      if (response.error) {
        if (response.error.response?.data.message === 'user already exists') {
          const response = await authService.fetchProfileByEmail({
            email: data.email
          });
          if (response.error) {
            return toast.error('Error signing up');
          } else if (response.data) {
            setUser(response.data);
            user_id = response.data.id;
          }
        }
      } else if (response.data) {
        setUser(response.data);
        user_id = response.data.id;
      }
    } else if (
      user_id &&
      (user.email !== data.email ||
        user.phone !== data.phone ||
        user.username !== data.username)
    ) {
      await authService
        .updateProfile(
          {
            email: data.email,
            username: data.username,
            phone: data.phone
          },
          {},
          {
            user_id
          }
        )
        .then(() => {
          setUser((p) =>
            p
              ? {
                  ...p,
                  username: data.username,
                  email: data.email,
                  phone: data.phone
                }
              : null
          );
          toast.success('Updated user profile');
        })
        .catch(() => toast.success('Error updating profile'));
    }
    if (!user_id || !order)
      toast.error('Something went wrong. Please try again');
    else {
      const response = await orderService.confirm(
        {
          user_id
        },
        {},
        {
          order_id: order.id
        }
      );
      if (response.error) {
        toast.error(
          response.error.response?.data.message === 'order invalid'
            ? 'This order has no items. Please check and try again'
            : 'Something went wrong. Please try again'
        );
      } else if (response.data) {
        toast.success('Order confirmed');
        onClose();
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      form.reset((p) => ({
        ...p,
        email: user.email,
        username: user.username,
        phone: user.phone
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title='Confirm Order' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>Name</FormLabel>
                <FormControl>
                  <Input
                    className='w-[80%]'
                    type='text'
                    placeholder="Enter user's username"
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
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>Email</FormLabel>
                <FormControl>
                  <Input
                    className='w-[80%]'
                    type='email'
                    placeholder="Enter user's email"
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
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div className='flex items-center gap-x-2'>
                    <p className='font-medium'>+91</p>
                    <Input
                      className='w-[72.5%]'
                      type='number'
                      placeholder='987-654-3210'
                      disabled={loading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmation'
            render={({ field }) => (
              <FormItem className='!mt-8'>
                <FormLabel>Type CONFIRM to proceed</FormLabel>
                <FormControl>
                  <Input placeholder='CONFIRM' disabled={loading} {...field} />
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
              Confirm Order
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
          onClick={() => push(`/dashboard/orders/${order.id}`)}
        >
          Modify Order Before Payment
        </Button>
      </div>
    </Modal>
  );
};
