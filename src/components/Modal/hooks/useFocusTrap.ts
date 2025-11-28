import React, { useEffect, RefObject } from 'react';

interface UseFocusTrapProps {
  isOpen: boolean;
  onClose: () => void;
  contentRef: RefObject<HTMLElement>;
}

const useFocusTrap = ({ isOpen, onClose, contentRef }: UseFocusTrapProps) => {
  const triggerRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    const getScrollbarWidth = () => {
      return window.innerWidth - document.documentElement.clientWidth;
    };

    if (isOpen && contentRef.current) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      contentRef.current.focus();

      const scrollbarWidth = getScrollbarWidth();
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab' || !contentRef.current) {
          return;
        }

        const focusableSelectors =
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';

        const focusableElements = Array.from(
          contentRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
        ).filter(
          (el) =>
            !el.hasAttribute('aria-hidden') &&
            el.offsetParent !== null &&
            !el.classList.contains('srOnly'),
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        if (!contentRef.current.contains(activeElement)) {
          event.preventDefault();
          firstElement.focus();
          return;
        }

        if (event.shiftKey) {
          if (
            activeElement === firstElement ||
            activeElement === contentRef.current
          ) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', handleTabKey);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keydown', handleTabKey);

        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose, contentRef]);
};

export default useFocusTrap;
