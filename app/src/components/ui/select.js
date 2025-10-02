import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../lib/utils';
export const Select = React.forwardRef((props, ref) => {
    const { className, children, ...rest } = props;
    return (_jsx("select", { ref: ref, className: cn('flex h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/60 transition-shadow', className), ...rest, children: children }));
});
Select.displayName = 'Select';
