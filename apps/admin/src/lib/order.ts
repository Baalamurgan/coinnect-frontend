import { OrderStatus } from '@/services/order/types';

export const isOrderEditable = (status: OrderStatus) =>
  ['pending', 'booked'].includes(status);
export const isOrderConfirmable = (status: string) => status === 'pending';
export const isOrderCancellable = (status: string) =>
  ['pending', 'booked', 'paid'].includes(status);
export const isOrderEligibleForMarkingPaid = (status: string) =>
  status === 'booked';
export const isOrderShippable = (status: string) => status === 'paid';
export const isOrderDeliverable = (status: string) => status === 'shipped';
export const isOrderRestorable = (status: string) => status === 'cancelled';

export const isOrderRecent = (updatedAt: string): boolean => {
  const updatedTime = new Date(Number(updatedAt) * 1000).getTime();
  const currentTime = new Date().getTime();
  const threshold = 10 * 60 * 1000;

  return currentTime - updatedTime <= threshold;
};
