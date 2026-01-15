import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number | null;
  action?: ToastAction;
  onClose?: () => void;
}

export interface Toast extends ToastOptions {
  id: string;
  type: ToastType;
}

interface UseToastReturn {
  toasts: Toast[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = options.id || `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      type: options.type || 'info',
      title: options.title,
      description: options.description,
      duration: options.duration ?? 5000,
      action: options.action,
      onClose: options.onClose,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.onClose) {
        toast.onClose();
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setToasts((prev) => {
      prev.forEach((toast) => {
        if (toast.onClose) {
          toast.onClose();
        }
      });
      return [];
    });
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };
};
