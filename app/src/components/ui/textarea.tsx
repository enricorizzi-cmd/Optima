import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary focus:ring-2 focus:ring-primary/60 transition-shadow',
        className
      )}
      {...rest}
    />
  );
});
Textarea.displayName = 'Textarea';
