import React, { forwardRef, useRef, RefObject } from 'react';
import { createPortal } from 'react-dom';

import useFocusTrap from './hooks/useFocusTrap';
import useOnClickOutside from './hooks/useOnClickOutside';

import { cn } from '../../utils/cn';
import styles from './Modal.module.css';

export interface ModalRootProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}
export interface ModalContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  titleId: string;
  descriptionId?: string;
  showCloseButton?: boolean;
}

const ModalTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h2 ref={ref} className={cn(styles.title, className)} {...props}>
    {children}
  </h2>
));
ModalTitle.displayName = 'ModalTitle';

const ModalHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.header, className)} {...props} />
));
ModalHeader.displayName = 'ModalHeader';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  cancelButton?: {
    label?: string;
    onClick?: () => void;
    show?: boolean;
  };
  confirmButton?: {
    label?: string;
    onClick?: () => void;
    show?: boolean;
  };
  onClose?: () => void;
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  (
    { className, cancelButton, confirmButton, onClose, children, ...props },
    ref,
  ) => {
    const showCancel =
      cancelButton === undefined || cancelButton?.show !== false;
    const showConfirm =
      confirmButton === undefined || confirmButton?.show !== false;
    const hasDefaultButtons = showCancel || showConfirm;

    return (
      <div ref={ref} className={cn(styles.footer, className)} {...props}>
        {children}
        {hasDefaultButtons && (
          <>
            {showCancel && (
              <button
                type="button"
                className={styles.footerButton}
                onClick={cancelButton?.onClick || onClose || (() => {})}
                aria-label={cancelButton?.label || 'Cancel'}
                title={cancelButton?.label || 'Cancel'}
              >
                {cancelButton?.label || 'Cancel'}
              </button>
            )}
            {showConfirm && (
              <button
                type="button"
                className={cn(styles.footerButton, styles.footerButtonPrimary)}
                onClick={confirmButton?.onClick || (() => {})}
                aria-label={confirmButton?.label || 'Confirm'}
                title={confirmButton?.label || 'Confirm'}
              >
                {confirmButton?.label || 'Confirm'}
              </button>
            )}
          </>
        )}
      </div>
    );
  },
);
ModalFooter.displayName = 'ModalFooter';

const ModalOverlay = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }
>(({ className, onClick, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(styles.overlay, className)}
    aria-hidden="true"
    onClick={onClick}
    {...props}
  />
));
ModalOverlay.displayName = 'ModalOverlay';

const ModalContent = forwardRef<
  HTMLDivElement,
  ModalContentProps & { onClose?: () => void }
>(
  (
    {
      children,
      className,
      titleId,
      descriptionId,
      showCloseButton = true,
      onClose,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={cn(styles.content, className)}
        {...props}
      >
        {children}
        {showCloseButton && onClose && (
          <button
            type="button"
            aria-label="Close dialog"
            className={styles.closeButton}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
            <span className={styles.srOnly}>Close</span>
          </button>
        )}
      </div>
    );
  },
);
ModalContent.displayName = 'ModalContent';

const ModalRoot = ({ isOpen, onClose, children }: ModalRootProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap({
    isOpen,
    onClose,
    contentRef: contentRef as RefObject<HTMLElement>,
  });

  useOnClickOutside(contentRef, onClose);

  if (!isOpen) return null;

  const handleCloseInjection = (child: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(child) && child.type === ModalContent) {
      const contentWithRef = React.cloneElement(child, {
        ref: contentRef,
        onClose,
      } as Partial<ModalContentProps> & {
        ref: RefObject<HTMLDivElement>;
        onClose: () => void;
      });

      const childrenWithClose = React.Children.map(
        (contentWithRef.props as ModalContentProps).children,
        (innerChild) => {
          if (
            React.isValidElement(innerChild) &&
            innerChild.type === ModalFooter
          ) {
            return React.cloneElement(innerChild, {
              onClose,
            } as Partial<ModalFooterProps> & {
              onClose: () => void;
            });
          }
          return innerChild;
        },
      );

      return React.cloneElement(
        contentWithRef as React.ReactElement<ModalContentProps>,
        { children: childrenWithClose },
      );
    }
    return child;
  };

  return createPortal(
    <div className={styles.modalContainer}>
      <ModalOverlay onClick={onClose} />
      {React.Children.map(children, handleCloseInjection)}
    </div>,
    document.body,
  );
};

export const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Content: ModalContent,
  Overlay: ModalOverlay,
  Header: ModalHeader,
  Title: ModalTitle,
  Footer: ModalFooter,
});
