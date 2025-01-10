import axios from 'axios';
import { Item } from 'types/api';

const API_HOST = `${process.env.NEXT_PUBLIC_API}/v1`;

export type ResponseType<T> = {
  success: boolean;
  time: number;
  message: string;
  total_products: number;
  offset: number;
  limit: number;
  products: T;
};

export const getAllItems = async ({
  limit = 5,
  page = 1,
  categories,
  search
}: {
  categories?: string | undefined;
  search?: string | undefined;
  page: number;
  limit: number;
}) => {
  const data = await axios.get<{
    data: Item[];
    status: boolean;
  }>(`${API_HOST}/item`);
  return {
    success: true,
    time: new Date().getTime(),
    message: 'Sample data for testing and learning purposes',
    total_products: data.data.data.length,
    offset: (page - 1) * limit,
    limit,
    products: data.data.data
  };
};
