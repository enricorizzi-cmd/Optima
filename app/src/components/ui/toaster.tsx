import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast';
import { ToastContext, type ToastInput, type ToastMessage } from './use-toast';

export function Toaster({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id?: string) => {
    if (!id) {
      setToasts([]);
      return;
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = input.id ?? crypto.randomUUID();
    setToasts((current) => [{ id, ...input }, ...current.filter((toastItem) => toastItem.id !== id)]);
    return id;
  }, []);

  const contextValue = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastProvider swipeDirection="right" duration={5000}>
        {toasts.map((toastItem) => (
          <Toast
            key={toastItem.id}
            variant={toastItem.variant}
            duration={toastItem.duration}
            onOpenChange={(open) => {
              if (!open) dismiss(toastItem.id);
            }}
            open
          >
            <div className="grid gap-1">
              {toastItem.title && <ToastTitle>{toastItem.title}</ToastTitle>}
              {toastItem.description && <ToastDescription>{toastItem.description}</ToastDescription>}
            </div>
            {toastItem.action}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}
