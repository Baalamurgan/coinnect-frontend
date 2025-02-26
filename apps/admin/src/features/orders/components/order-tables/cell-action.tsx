'use client';

import { Profile } from '@/services/auth/types';
import { orderService } from '@/services/order/services';
import { Order } from '@/services/order/types';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu';
import {
  isOrderCancellable,
  isOrderConfirmable,
  isOrderDeliverable,
  isOrderEditable,
  isOrderEligibleForMarkingPaid,
  isOrderRestorable,
  isOrderShippable
} from '@/src/lib/order';
import {
  CheckCircle,
  Edit,
  MoreHorizontal,
  Package,
  RotateCcw,
  TicketCheck,
  Trash,
  Truck,
  View,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CancelOrderModal } from './modal/cancel-order-modal';
import { ConfirmOrderModal } from './modal/confirm-order-modal';
import { DeleteOrderModal } from './modal/delete-order-modal';
import { MarkAsDeliveredModal } from './modal/mark-as-delivered-modal';
import { MarkAsPaidModal } from './modal/mark-as-paid-modal';
import { MarkAsShippedModal } from './modal/mark-as-shipped-modal';
import { RestoreOrderModal } from './modal/restore-order-modal';
import { authService } from '@/services/auth/service';
import { searchParams } from '@/src/lib/searchparams';
import { useQueryState } from 'nuqs';

interface CellActionProps {
  data: Order;
}

export type ModalTypes =
  | 'confirm'
  | 'mark_as_paid'
  | 'mark_as_shipped'
  | 'mark_as_delivered'
  | 'cancel'
  | 'restore'
  | 'delete';

export const CellAction: React.FC<CellActionProps> = ({ data: order }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<Profile | undefined | null>();
  const [modalOpen, setModalOpen] = useState<ModalTypes | null>(null);
  const router = useRouter();
  const [modalQuery] = useQueryState(
    'modal',
    searchParams.modalQuery.withOptions({ shallow: false, throttleMs: 1000 })
  );
  const [orderIDQuery] = useQueryState(
    'order_id',
    searchParams.order_id.withOptions({ shallow: false, throttleMs: 1000 })
  );
  console.log(modalQuery);

  const onDelete = async () => {
    setLoading(true);
    const response = await orderService.delete(
      {},
      {},
      {
        order_id: order.id
      }
    );
    console.log(response);

    if (response.data) {
      setOpen(false);
      toast.success('Deleted order successfully');
    } else if (response.error) {
      toast.error('Error deleting order');
      setLoading(false);
    }
  };

  const ModalComponentMap: Record<
    ModalTypes,
    React.FC<{
      isOpen: boolean;
      onClose: () => void;
      loading: boolean;
      order: Order;
      user: Profile | null | undefined;
      setUser: Dispatch<SetStateAction<Profile | null | undefined>>;
    }>
  > = {
    confirm: ConfirmOrderModal,
    cancel: CancelOrderModal,
    delete: DeleteOrderModal,
    mark_as_delivered: MarkAsDeliveredModal,
    mark_as_paid: MarkAsPaidModal,
    mark_as_shipped: MarkAsShippedModal,
    restore: RestoreOrderModal
  };

  const ModalComponent = modalOpen ? ModalComponentMap[modalOpen] : Fragment;

  useEffect(() => {
    const getUser = async (user_id: string) => {
      const response = await authService.fetchProfile(
        {
          user_id
        },
        {},
        {}
      );
      if (response.error) {
        toast.error('Error fetching user');
        setUser(null);
      } else if (response.data) setUser(response.data);
    };

    if (modalQuery && orderIDQuery) setModalOpen(modalQuery);
    if (
      orderIDQuery === order.id &&
      order.user_id &&
      !order.user_id.startsWith('0000')
    ) {
      getUser(order.user_id);
    } else setUser(null);
  }, [order, modalQuery]);

  return (
    <>
      {modalOpen && orderIDQuery === order.id && (
        <ModalComponent
          key={1}
          isOpen={true}
          loading={loading}
          onClose={() => {
            router.push(`/dashboard/orders`);
            setModalOpen(null);
          }}
          order={order}
          user={user}
          setUser={setUser}
        />
      )}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* View Order */}
          <DropdownMenuItem
            className='hidden text-blue-500'
            onClick={() =>
              router.push(`/dashboard/orders/${order.id}?edit=false`)
            }
          >
            <View className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>

          {/* Update Order */}
          {isOrderEditable(order.status) && (
            <DropdownMenuItem
              className='hidden text-yellow-500'
              onClick={() =>
                router.push(`/dashboard/orders/${order.id}?edit=true`)
              }
            >
              <Edit className='mr-2 h-4 w-4' /> Update
            </DropdownMenuItem>
          )}

          {/* Confirm Order */}
          {isOrderConfirmable(order.status) && (
            <DropdownMenuItem
              className='text-green-500'
              onClick={() => {
                router.push(
                  `/dashboard/orders?modal=confirm&order_id=${order.id}`
                );
                // setModalOpen('confirm');
                console.log('Marking order as Paid', order.id);
              }}
            >
              <TicketCheck className='mr-2 h-4 w-4' /> Confirm
            </DropdownMenuItem>
          )}

          {/* Mark as Paid */}
          {isOrderEligibleForMarkingPaid(order.status) && (
            <DropdownMenuItem
              className='text-green-500'
              onClick={() => {
                router.push(
                  `/dashboard/orders?modal=mark_as_paid&order_id=${order.id}`
                );
                // setModalOpen('mark_as_paid');
                console.log('Marking order as Paid', order.id);
              }}
            >
              <CheckCircle className='mr-2 h-4 w-4' /> Mark as Paid
            </DropdownMenuItem>
          )}

          {/* Ship Order */}
          {isOrderShippable(order.status) && (
            <DropdownMenuItem
              className='text-blue-500'
              onClick={() => {
                router.push(
                  `/dashboard/orders?modal=mark_as_shipped&order_id=${order.id}`
                );
                // setModalOpen('mark_as_shipped');
                console.log('Marking order as Shipped', order.id);
              }}
            >
              <Truck className='mr-2 h-4 w-4' /> Mark as Shipped
            </DropdownMenuItem>
          )}

          {/* Deliver Order */}
          {isOrderDeliverable(order.status) && (
            <DropdownMenuItem
              className='text-purple-500'
              onClick={() => {
                router.push(
                  `/dashboard/orders?modal=mark_as_delivered&order_id=${order.id}`
                );
                // setModalOpen('mark_as_delivered');
                console.log('Marking order as Delivered', order.id);
              }}
            >
              <Package className='mr-2 h-4 w-4' /> Mark as Delivered
            </DropdownMenuItem>
          )}

          {/* Cancel Order */}
          {isOrderCancellable(order.status) && (
            <DropdownMenuItem
              className='text-red-500'
              onClick={() => {
                router.push(
                  `/dashboard/orders?modal=cancel&order_id=${order.id}`
                );
                // setModalOpen('cancel');
                console.log('Cancelling order', order.id);
              }}
            >
              <XCircle className='mr-2 h-4 w-4' /> Cancel Order
            </DropdownMenuItem>
          )}

          {/* Restore Cancelled Order */}
          {isOrderRestorable(order.status) && (
            <DropdownMenuItem
              className='text-yellow-500'
              onClick={() => {
                router.push(
                  `/dashboard/orders?modal=restore&order_id=${order.id}`
                );
                // setModalOpen('restore');
                console.log('Restoring order', order.id);
              }}
            >
              <RotateCcw className='mr-2 h-4 w-4' /> Restore Order
            </DropdownMenuItem>
          )}

          {/* Delete Order */}
          <DropdownMenuItem
            className='text-red-800'
            onClick={() => {
              router.push(
                `/dashboard/orders?modal=delete&order_id=${order.id}`
              );
              // setModalOpen('delete');
              console.log('Delleting order', order.id);
            }}
          >
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
