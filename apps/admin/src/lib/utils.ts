import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const replaceMultiple = (
  str: string,
  translator: Record<string, string>
) => {
  return Object.entries(translator).reduce((acc, [from, to]) => {
    const regex = new RegExp(`\\b${from}\\b`, 'gi');
    return acc.replace(regex, to);
  }, str);
};

export const sentencize = (
  str: string = '',
  {
    splitter,
    joiner,
    translator = {}
  }: {
    splitter?: string;
    joiner?: string;
    translator?: Record<string, string>;
  } = {}
): string =>
  replaceMultiple(str, translator)
    .split(splitter || '_')
    .map((word) => {
      const capitalised = word === 'id' ? 'ID' : capitalize(word);
      return capitalised.includes('.')
        ? sentencize(capitalised, { splitter: '.', joiner: '.' })
        : capitalised.includes('"')
          ? sentencize(capitalised, { splitter: '"', joiner: '"' })
          : capitalised;
    })
    .join(joiner ?? ' ');

export const linkToBlob = async (url: string) => {
  const response = await fetch(url, {
    mode: 'no-cors'
  });
  const blob = await response.blob();
  const file = new File([blob], 'image.webp', { type: 'image/webp' });
  return file;
};
