import { cn } from '@/src/lib/utils';
import { JSX } from 'react';

const Tag = ({
  color,
  className,
  children
}: {
  color?: 'green' | 'yellow' | 'red';
  className?: string;
  children: string | JSX.Element;
}) => {
  return (
    <div
      className={cn(
        'flex w-fit items-center justify-center rounded-lg border border-green-400 bg-green-200 px-2 py-0.5',
        color === 'green'
          ? 'border-green-700 bg-green-200/10 text-green-400 hover:bg-green-500/50'
          : color === 'yellow'
            ? 'border-yellow-700 bg-yellow-200/10 text-yellow-400 hover:bg-yellow-500/50'
            : color === 'red'
              ? 'border-red-700 bg-red-200/10 text-red-400 hover:bg-red-500/50'
              : 'border-black bg-black/10 text-black',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Tag;
