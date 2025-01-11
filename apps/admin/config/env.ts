export const envs = {
  NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API || '',
  NEXT_PUBLIC_ENV: (process.env.NEXT_PUBLIC_ENV || '') as
    | 'development'
    | 'staging'
    | 'production'
};
