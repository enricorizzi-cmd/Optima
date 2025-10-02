import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none shadow-neon', {
    variants: {
        variant: {
            primary: 'bg-primary text-white hover:bg-primary/90',
            secondary: 'bg-accent/20 text-primary border border-primary hover:bg-accent/40',
            outline: 'border border-primary text-primary hover:bg-primary/10',
            ghost: 'text-primary hover:bg-primary/10',
            danger: 'bg-danger text-white hover:bg-danger/80',
        },
        size: {
            sm: 'h-9 px-3 text-xs',
            md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-6 text-base',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});
export const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return _jsx(Comp, { ref: ref, className: cn(buttonVariants({ variant, size }), className), ...props });
});
Button.displayName = 'Button';
