import { createContext, useContext } from 'react';
import type { ToastActionElement } from './toast';

type ToastVariant = 'default' | 'success' | 'destructive';

export interface ToastMessage {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
  action?: ToastActionElement;
}

export type ToastInput = Omit<ToastMessage, 'id'> & { id?: string };

export interface ToastContextValue {
  toasts: ToastMessage[];
  toast: (toast: ToastInput) => string;
  dismiss: (id?: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve essere utilizzato all’interno di <Toaster />');
  }
  return context;
}
