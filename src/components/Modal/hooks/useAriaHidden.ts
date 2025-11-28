import { useEffect, RefObject } from 'react';

interface UseAriaHiddenProps {
  isOpen: boolean;
  modalContainerRef: RefObject<HTMLElement>;
}

/** Manages the hiding of background content for screen readers */
const useAriaHidden = ({ isOpen, modalContainerRef }: UseAriaHiddenProps) => {
  useEffect(() => {
    if (!isOpen) return;

    let hiddenElements: Array<{
      element: HTMLElement;
      previousValue: string | null;
    }> = [];

    const timeoutId = setTimeout(() => {
      if (!modalContainerRef.current) return;

      /** Hide all child elements of the body, except the modal container */
      const bodyChildren = Array.from(document.body.children) as HTMLElement[];
      const modalContainer = modalContainerRef.current;

      hiddenElements = bodyChildren
        .filter(
          (child) =>
            child !== modalContainer && !child.contains(modalContainer),
        )
        .map((child) => {
          const previousValue = child.getAttribute('aria-hidden');
          if (!previousValue || previousValue === 'false') {
            child.setAttribute('aria-hidden', 'true');
          }
          return { element: child, previousValue };
        });
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      hiddenElements.forEach(({ element, previousValue }) => {
        if (previousValue === null) {
          element.removeAttribute('aria-hidden');
        } else {
          element.setAttribute('aria-hidden', previousValue);
        }
      });
    };
  }, [isOpen, modalContainerRef]);
};

export default useAriaHidden;
