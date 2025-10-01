import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/60 transition-shadow',
        className
      )}
      {...rest}
    />
  );
});
Textarea.displayName = 'Textarea';
