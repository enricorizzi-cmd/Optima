import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:ring-2 focus:ring-primary/60 transition-shadow',
        className
      )}
      {...rest}
    />
  );
});
Input.displayName = 'Input';
