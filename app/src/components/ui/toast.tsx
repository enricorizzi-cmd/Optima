import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>;

type ToastActionElement = React.ReactElement<typeof ToastPrimitives.Action>;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border border-white/10 bg-[#12182b] p-4 shadow-xl shadow-primary/10 backdrop-blur transition-all',
  {
    variants: {
      variant: {
        default: 'text-white',
        success: 'border-success/40 bg-success/20 text-success',
        destructive: 'border-danger/40 bg-danger/10 text-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const ToastContext = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Viewport>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-3 p-6 sm:bottom-auto sm:right-0 sm:top-0 sm:flex-col',
        className
      )}
      {...props}
    />
  )
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Root>, ToastProps & VariantProps<typeof toastVariants>>(
  ({ className, variant, ...props }, ref) => {
    return (
      <ToastPrimitives.Root
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Title>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
  )
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Description>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Description ref={ref} className={cn('text-sm text-white/70', className)} {...props} />
  )
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

const ToastAction = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Action>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl border border-white/20 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/60',
        className
      )}
      {...props}
    />
  )
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Close>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Close
      ref={ref}
      className={cn('absolute right-3 top-3 rounded-full p-1 text-white/40 transition hover:text-white', className)}
      toast-close=""
      {...props}
    >
      ✕
    </ToastPrimitives.Close>
  )
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

export type { ToastProps, ToastActionElement };
export { Toast, ToastAction, ToastClose, ToastContext as ToastProvider, ToastDescription, ToastTitle, ToastViewport };
