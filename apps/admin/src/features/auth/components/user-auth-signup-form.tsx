'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from 'context/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from 'services/auth/service';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  username: z.string().min(1, {
    message: 'Enter your name'
  }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Enter a valid password' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthSignupForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const { push } = useRouter();
  const { fetchProfile } = useAuth();

  const defaultValues = {
    username: '',
    email: '',
    password: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      const response = await authService.signup(
        {
          email: data.email,
          username: data.username,
          password: data.password
        },
        {}
      );
      if (response.error) toast.error('Error signing up');
      else if (response.data) {
        localStorage.setItem('email', data.email);
        fetchProfile();
        push(callbackUrl ?? '/dashboard');
        toast.success(`Signed up ${data.email} successfully`);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Enter your username'
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email'
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
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='********'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className='ml-auto w-full' type='submit'>
            Create Account
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or</span>
        </div>
      </div>
      <Link href='/login'>
        <Button
          disabled={loading}
          className='ml-auto w-full'
          type='submit'
          variant={'secondary'}
        >
          Login
        </Button>
      </Link>
    </>
  );
}
