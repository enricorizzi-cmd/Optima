import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
export const Table = ({ className, ...props }) => (_jsx("table", { className: cn('w-full border-collapse text-sm text-gray-900', className), ...props }));
export const Thead = ({ className, ...props }) => (_jsx("thead", { className: cn('bg-gray-50 text-left uppercase text-xs text-gray-600', className), ...props }));
export const Tbody = ({ className, ...props }) => (_jsx("tbody", { className: cn('divide-y divide-gray-200', className), ...props }));
export const Tr = ({ className, ...props }) => (_jsx("tr", { className: cn('hover:bg-gray-50 transition-colors', className), ...props }));
export const Th = ({ className, ...props }) => (_jsx("th", { className: cn('px-4 py-3 font-medium tracking-wide', className), ...props }));
export const Td = ({ className, ...props }) => (_jsx("td", { className: cn('px-4 py-3 align-top', className), ...props }));
