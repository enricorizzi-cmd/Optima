import { createContext, useContext } from 'react';
export const ToastContext = createContext(undefined);
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve essere utilizzato all’interno di <Toaster />');
    }
    return context;
}
