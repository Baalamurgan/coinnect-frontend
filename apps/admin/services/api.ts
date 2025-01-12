import { ifSpreadObject } from '@/lib/ifSpread';
import axios, { AxiosRequestConfig } from 'axios';
import { envs } from 'config/env';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

export const API_HOST = envs.NEXT_PUBLIC_API;

const userAgentHeaders = () => ({
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
});

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface Options<Req> extends Omit<AxiosRequestConfig<Req>, 'url'> {
  url?: string;
}

export type Fetcher<Res, Req = any, Query = any> = (
  body?: Req,
  options?: Options<Req>,
  urlParams?: Query
) => Promise<ResWrapper<Res>>;

export interface DefaultOptions<Query = {}>
  extends Omit<AxiosRequestConfig, 'url'> {
  url: string | ((param: Query) => string);
  token?: string;
  isFormData?: boolean;
  withUserAgent?: boolean;
}

export interface ErrorResponse {
  code: 'ERR_BAD_RESPONSE' | string;
  config: any;
  message: 'Request failed with status code 500' | string;
  name: 'AxiosError' | string;
  stack: 'AxiosError: Request failed with status code 500\n    at settle (webpack-internal:///(rsc)/../../node_modules/axios/lib/core/settle.js:24:12)\n    at IncomingMessage.handleStreamEnd (webpack-internal:///(rsc)/../../node_modules/axios/lib/adapters/http.js:629:71)\n    at IncomingMessage.emit (node:events:531:35)\n    at endReadableNT (node:internal/streams/readable:1696:12)\n    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)\n    at Axios.request (webpack-internal:///(rsc)/../../node_modules/axios/lib/core/Axios.js:57:41)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async eval (webpack-internal:///(rsc)/./services/api.ts:40:16)\n    at async ProductListingPage (webpack-internal:///(rsc)/./src/features/products/components/product-listing.tsx:32:26)';
  status: 400 | 409 | 500 | 502;
  response?: {
    data: {
      err: string;
      status: 'fail';
    };
    status: number;
    statusText: string;
  } & Record<string, any>;
}

export interface ResWrapper<T> {
  data?: T;
  status?: number;
  error?: ErrorResponse;
}

export const createFetcher =
  <Res = any, Req = any, Query = any>({
    url,
    token,
    isFormData,
    withUserAgent,
    headers,
    ...defaultOptions
  }: DefaultOptions<Query>): Fetcher<Res, Req, Query> =>
  async (
    body?: Req,
    options: Options<Req> = {},
    urlParams?: Query
  ): Promise<ResWrapper<Res>> => {
    // LOG ALL APIS CALLED DURING BUILD OR SSR
    const route =
      typeof url === 'function' ? url(urlParams || ({} as Query)) : url || '';
    if (typeof window === 'undefined') {
      console.log(route);
    }
    const allHeaders = {
      'Content-Type': 'application/json',
      ...ifSpreadObject(!!isFormData, {
        'Content-Type': 'multipart/form-data'
      }),
      ...ifSpreadObject(!!token, {
        Authorization:
          typeof window !== 'undefined' &&
          token &&
          `Bearer ${JSON.parse(localStorage.getItem(token) ?? '')}`
      }),
      ...ifSpreadObject(typeof window === 'undefined' && !!withUserAgent, {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      }),
      ...headers
    };
    return await axios({
      headers: allHeaders,
      url: route,
      timeout:
        process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD // ignoring 3000ms timeout error in vercel build time for blogs
          ? undefined
          : typeof window === 'undefined'
            ? 3000
            : undefined,
      ...defaultOptions,
      ...options,
      data: isFormData
        ? body
        : {
            ...defaultOptions.data,
            ...options.data,
            ...body
          },
      params: {
        ...defaultOptions.params,
        ...options.params
      }
    })
      .then((res) => {
        return { ...res.data };
      })
      .catch((error) => {
        console.log(error);
        return { error };
      });
  };

export const apiRoute = (path: string) => `${API_HOST}/v1${path}`;
export const domain = (path: string) =>
  typeof window === 'undefined' ? `https://localhost:3004${path}` : path;

export const ROUTES = {
  ITEM: {
    GETALL: apiRoute('/item'),
    GET: (p: { item_id: string }) => apiRoute(`/item/${p.item_id}`),
    CREATE: (p: { category_id: string }) => apiRoute(`/item/${p.category_id}`),
    UPDATE: (p: { item_id: string }) => apiRoute(`/item/${p.item_id}`),
    DELETE: (p: { item_id: string }) => apiRoute(`/item/${p.item_id}`)
  },
  AUTH: {
    LOGIN: apiRoute('/auth/login'),
    SIGNUP: apiRoute('/auth/signup'),
    FETCHPROFILE: apiRoute('/auth/profile')
  }
};
