'use client';
import { authService } from '@/services/auth/service';
import { Profile } from '@/services/auth/types';
import { orderService } from '@/services/order/services';
import { Order } from '@/services/order/types';
import PageContainer from '@/src/components/layout/page-container';
import Loader from '@/src/components/Loader';
import Tag from '@/src/components/ui/tag';
import OrderInfo from '@/src/features/orders/components/order-info';
import { STATUS_OPTIONS } from '@/src/features/orders/components/order-tables/use-order-table-filters';
import UserInfo from '@/src/features/orders/components/user-info';
import displayPrice from '@/src/lib/price';
import { sentencize } from '@/src/lib/utils';
import { TrashIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const OrderPage = () => {
  const { order_id } = useParams();
  const { back } = useRouter();
  const [order, setOrder] = useState<Order | undefined | null>(undefined);
  const [user, setUser] = useState<Profile | undefined | null>(undefined);
  const [isLoading, setLoading] = useState(false);

  const fetchOrder = async (order_id: string) => {
    console.log('fetching order');
    setOrder(undefined);
    setLoading(true);
    if (order_id) {
      const response = await orderService.getById(
        {},
        {},
        {
          order_id
        }
      );
      if (response.error) {
        setOrder(null);
      } else if (response.data) {
        setOrder(response.data);
        if (response.data.user_id) fetchProfile(response.data.user_id);
      }
    } else {
      setOrder(null);
    }
    setLoading(false);
  };

  const fetchProfile = async (user_id: string) => {
    setUser(undefined);
    setLoading(true);
    if (user_id) {
      const response = await authService.fetchProfile(
        {
          user_id
        },
        {}
      );
      if (response.error) {
        setUser(null);
        if (response.error.response?.data.message === 'not found') {
          toast.error('User account not found. Please try again');
          back();
        }
      } else if (response.data) {
        setUser(response.data);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const removeItemFromOrderHandler = async ({
    order_id,
    order_item_id
  }: {
    order_id: string;
    order_item_id: string;
  }): Promise<{ success: boolean }> => {
    if (order_id) {
      const response = await orderService.removeItem(
        {},
        {},
        {
          order_id,
          order_item_id
        }
      );
      if (response.error) {
        setOrder(null);
        toast.error('Something went wrong. Please try again');
        return { success: false };
      } else if (response.data) {
        toast.success('Item removed from order');
        await fetchOrder(order_id);
        return { success: true };
      }
    }
    return { success: false };
  };

  useEffect(() => {
    console.log(order_id);
    if (order_id && typeof order_id === 'string') fetchOrder(order_id);
  }, [order_id]);

  if (isLoading) return <Loader />;

  if (order)
    return (
      <PageContainer>
        <div className='flex flex-col'>
          <h2 className='text-xl'>User Details</h2>
          <div className='mt-3'>
            <UserInfo user={user} />
          </div>
          <div className='mt-10'>
            <div className='flex items-center gap-x-3'>
              <h2 className='text-xl'>Order Details</h2>
              <Tag
                color={
                  STATUS_OPTIONS.find((s) => s.value === order.status)?.color
                }
              >
                {sentencize(order.status)}
              </Tag>
            </div>
          </div>
          <div className='mt-3 pb-10'>
            <OrderInfo
              order={order}
              removeItemFromOrderHandler={removeItemFromOrderHandler}
            />
          </div>
        </div>
      </PageContainer>
    );
};

export default OrderPage;
