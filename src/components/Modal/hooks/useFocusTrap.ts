import React, { useEffect, RefObject } from 'react';

interface UseFocusTrapProps {
  isOpen: boolean;
  onClose: () => void;
  contentRef: RefObject<HTMLElement>;
}

const useFocusTrap = ({ isOpen, onClose, contentRef }: UseFocusTrapProps) => {
  const triggerRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const getScrollbarWidth = () => {
      return window.innerWidth - document.documentElement.clientWidth;
    };

    triggerRef.current = document.activeElement as HTMLElement | null;

    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const getFocusableElements = (container: HTMLElement) => {
      const focusableSelectors =
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors),
      ).filter(
        (el) =>
          !el.hasAttribute('aria-hidden') &&
          el.offsetParent !== null &&
          !el.classList.contains('srOnly'),
      );
    };

    const focusFirstElement = () => {
      if (!contentRef.current) return;

      const focusableElements = getFocusableElements(contentRef.current);

      if (focusableElements.length > 0) {
        focusableElements[0]?.focus();
      } else {
        contentRef.current.focus();
      }
    };

    const focusTimeout = setTimeout(() => {
      if (contentRef.current) {
        focusFirstElement();
      }
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !contentRef.current) {
        return;
      }

      const focusableElements = getFocusableElements(contentRef.current);

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

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown, true);

      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      if (triggerRef.current) {
        setTimeout(() => {
          triggerRef.current?.focus();
        }, 0);
      }
    };
  }, [isOpen, onClose, contentRef]);
};

export default useFocusTrap;
