import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <select
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/60 transition-shadow',
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';
