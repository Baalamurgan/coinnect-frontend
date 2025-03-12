export const toEpoch = (d: string | number | Date) =>
  Math.floor(new Date(d).getTime() / 1000);
export const fromEpoch = (d: number) =>
  new Date(d * 1000).toISOString().split('T')[0];
