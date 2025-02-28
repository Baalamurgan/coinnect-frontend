import { cn } from '@/src/lib/utils';
import { JSX } from 'react';

const Tag = ({
  color,
  className,
  children
}: {
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'orange' | 'teal' | string;
  className?: string;
  children: string | JSX.Element;
}) => {
  return (
    <div
      className={cn(
        'flex w-fit items-center justify-center rounded-lg border px-2 py-0.5 text-sm font-medium',
        color === 'green'
          ? 'border-green-700 bg-green-200/10 text-green-400 hover:bg-green-500/50'
          : color === 'yellow'
            ? 'border-yellow-700 bg-yellow-200/10 text-yellow-400 hover:bg-yellow-500/50'
            : color === 'red'
              ? 'border-red-700 bg-red-200/10 text-red-400 hover:bg-red-500/50'
              : color === 'blue'
                ? 'border-blue-700 bg-blue-200/10 text-blue-400 hover:bg-blue-500/50'
                : color === 'orange'
                  ? 'border-orange-700 bg-orange-200/10 text-orange-400 hover:bg-orange-500/50'
                  : color === 'teal'
                    ? 'border-teal-700 bg-teal-200/10 text-teal-400 hover:bg-teal-500/50'
                    : 'border-gray-700 bg-gray-200/10 text-gray-400 hover:bg-gray-500/50',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Tag;
