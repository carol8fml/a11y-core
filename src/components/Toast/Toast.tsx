import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import styles from './Toast.module.css';
import type {
  Toast as ToastType,
  ToastPosition,
  ToastAction,
} from './hooks/useToast';

const toastVariants = cva(styles.base, {
  variants: {
    type: {
      success: styles.success,
      error: styles.error,
      warning: styles.warning,
      info: styles.info,
    },
  },
  defaultVariants: {
    type: 'info',
  },
});

export interface ToastProps {
  toast: ToastType;
  position?: ToastPosition;
  onClose: (id: string) => void;
}

const ToastComponent = ({
  toast,
  position = 'top-right',
  onClose,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  const handleClose = React.useCallback(() => {
    setIsExiting(true);
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }
    exitTimeoutRef.current = setTimeout(() => {
      onClose(toast.id);
    }, 200);
  }, [toast.id, onClose]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  useEffect(() => {
    if (toast.duration === null || toast.duration === undefined) {
      return;
    }

    if (toast.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, toast.duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [toast.duration, toast.id, handleClose]);

  const handleActionClick = (action: ToastAction) => {
    action.onClick();
    handleClose();
  };

  const role = toast.type === 'error' ? 'alert' : 'status';
  const ariaLive = toast.type === 'error' ? 'assertive' : 'polite';

  return createPortal(
    <div
      ref={toastRef}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={cn(
        styles.toastContainer,
        styles[position],
        isVisible && !isExiting && styles.visible,
        isExiting && styles.exiting,
      )}
    >
      <div className={cn(toastVariants({ type: toast.type }))}>
        <div className={styles.content}>
          {toast.title && (
            <div className={styles.title} id={`toast-title-${toast.id}`}>
              {toast.title}
            </div>
          )}
          {toast.description && (
            <div
              className={styles.description}
              id={`toast-description-${toast.id}`}
              aria-labelledby={
                toast.title ? `toast-title-${toast.id}` : undefined
              }
            >
              {toast.description}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {toast.action && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => handleActionClick(toast.action!)}
              aria-label={toast.action.label}
            >
              {toast.action.label}
            </button>
          )}
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close notification"
          >
            <span aria-hidden="true">×</span>
            <span className={styles.srOnly}>Close</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

ToastComponent.displayName = 'Toast';

ToastComponent.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.number,
    action: PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
    onClose: PropTypes.func,
  }).isRequired,
  position: PropTypes.oneOf([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ]),
  onClose: PropTypes.func.isRequired,
};

export const Toast = React.memo(ToastComponent);

export interface ToastContainerProps {
  toasts: ToastType[];
  position?: ToastPosition;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  onClose,
}) => {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          position={position}
          onClose={onClose}
        />
      ))}
    </>
  );
};
