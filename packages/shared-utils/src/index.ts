export const add = (a: number, b: number): number => a + b;

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
