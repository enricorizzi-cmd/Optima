import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <input
      ref={ref}
      className={cn(
        'flex min-h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/60 transition-shadow disabled:bg-gray-50 disabled:text-gray-500',
        className
      )}
      {...rest}
    />
  );
});
Input.displayName = 'Input';
