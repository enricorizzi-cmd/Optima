import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast';
import { ToastContext } from './use-toast';
export function Toaster({ children }) {
    const [toasts, setToasts] = useState([]);
    const dismiss = useCallback((id) => {
        if (!id) {
            setToasts([]);
            return;
        }
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);
    const toast = useCallback((input) => {
        const id = input.id ?? crypto.randomUUID();
        setToasts((current) => [{ id, ...input }, ...current.filter((toastItem) => toastItem.id !== id)]);
        return id;
    }, []);
    const contextValue = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);
    return (_jsxs(ToastContext.Provider, { value: contextValue, children: [children, _jsxs(ToastProvider, { swipeDirection: "right", duration: 5000, children: [toasts.map((toastItem) => (_jsxs(Toast, { variant: toastItem.variant, duration: toastItem.duration, onOpenChange: (open) => {
                            if (!open)
                                dismiss(toastItem.id);
                        }, open: true, children: [_jsxs("div", { className: "grid gap-1", children: [toastItem.title && _jsx(ToastTitle, { children: toastItem.title }), toastItem.description && _jsx(ToastDescription, { children: toastItem.description })] }), toastItem.action, _jsx(ToastClose, {})] }, toastItem.id))), _jsx(ToastViewport, {})] })] }));
}
