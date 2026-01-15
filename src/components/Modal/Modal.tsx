import React, { forwardRef, useRef, RefObject } from 'react';
import { createPortal } from 'react-dom';

import useFocusTrap from './hooks/useFocusTrap';
import useOnClickOutside from './hooks/useOnClickOutside';
import useAriaHidden from './hooks/useAriaHidden';

import { cn } from '../../utils/cn';
import styles from './Modal.module.css';

export interface ModalRootProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  overlayAriaLabel?: string;
}
export interface ModalContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  titleId: string;
  descriptionId?: string;
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
  closeButtonSrText?: string;
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
  defaultCancelLabel?: string;
  defaultConfirmLabel?: string;
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  (
    {
      className,
      cancelButton,
      confirmButton,
      onClose,
      children,
      defaultCancelLabel,
      defaultConfirmLabel,
      ...props
    },
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
                onClick={() => {
                  if (cancelButton?.onClick) {
                    cancelButton.onClick();
                  }
                  if (onClose) {
                    onClose();
                  }
                }}
                aria-label={
                  cancelButton?.label || defaultCancelLabel || 'Cancel'
                }
                title={cancelButton?.label || defaultCancelLabel || 'Cancel'}
              >
                {cancelButton?.label || defaultCancelLabel || 'Cancel'}
              </button>
            )}
            {showConfirm && (
              <button
                type="button"
                className={cn(styles.footerButton, styles.footerButtonPrimary)}
                onClick={confirmButton?.onClick || (() => {})}
                aria-label={
                  confirmButton?.label || defaultConfirmLabel || 'Confirm'
                }
                title={confirmButton?.label || defaultConfirmLabel || 'Confirm'}
              >
                {confirmButton?.label || defaultConfirmLabel || 'Confirm'}
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
  React.HTMLAttributes<HTMLDivElement> & {
    onClick?: () => void;
    'aria-label'?: string;
  }
>(({ className, onClick, 'aria-label': ariaLabel, ...props }, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      className={cn(styles.overlay, className)}
      onClick={onClick}
      onKeyDown={onClick && ariaLabel ? handleKeyDown : undefined}
      role={onClick && ariaLabel ? 'button' : undefined}
      tabIndex={onClick && ariaLabel ? -1 : undefined}
      aria-label={onClick && ariaLabel ? ariaLabel : undefined}
      {...props}
    />
  );
});
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
      closeButtonAriaLabel,
      closeButtonSrText,
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
        aria-describedby={descriptionId || undefined}
        tabIndex={-1}
        className={cn(styles.content, className)}
        {...props}
      >
        {children}
        {showCloseButton !== false && onClose && (
          <button
            type="button"
            aria-label={closeButtonAriaLabel || 'Close dialog'}
            className={styles.closeButton}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
            <span className={styles.srOnly}>
              {closeButtonSrText || 'Close'}
            </span>
          </button>
        )}
      </div>
    );
  },
);
ModalContent.displayName = 'ModalContent';

const ModalRoot = ({
  isOpen,
  onClose,
  children,
  overlayAriaLabel,
}: ModalRootProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  useFocusTrap({
    isOpen,
    onClose,
    contentRef: contentRef as RefObject<HTMLElement>,
  });

  useOnClickOutside(contentRef, onClose);

  useAriaHidden({
    isOpen,
    modalContainerRef: modalContainerRef as RefObject<HTMLElement>,
  });

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
    <div ref={modalContainerRef} className={styles.modalContainer}>
      <ModalOverlay onClick={onClose} aria-label={overlayAriaLabel} />
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
