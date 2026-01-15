import { render, screen, cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Toast } from './Toast';
import { useToast } from './hooks/useToast';
import type { Toast as ToastType } from './hooks/useToast';

expect.extend(toHaveNoViolations);

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('Component: Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.requestAnimationFrame = vi.fn((cb) => {
      cb(0);
      return 1;
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllTimers();
    document.body.innerHTML = '';
  });

  describe('Accessibility (Axe)', () => {
    it('should have no accessibility violations - error toast with action (covers alert role, aria-live="assertive", aria-atomic, action button, close button)', async () => {
      const toast: ToastType = {
        id: 'test-error-action',
        type: 'error',
        title: 'Error',
        description: 'Something went wrong. Please confirm.',
        action: {
          label: 'Confirm',
          onClick: vi.fn(),
        },
      };

      let container: HTMLElement;
      await act(async () => {
        const result = render(<Toast toast={toast} onClose={vi.fn()} />);
        container = result.container;
      });

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /confirm/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /close/i }),
      ).toBeInTheDocument();

      vi.useRealTimers();
      const results = await axe(container!);
      vi.useFakeTimers();

      expect(results).toHaveNoViolations();
    }, 10000);
  });

  describe('Functionality', () => {
    it('should render toast with title and description', async () => {
      const toast: ToastType = {
        id: 'test-1',
        type: 'success',
        title: 'Success',
        description: 'Operation completed',
      };

      await act(async () => {
        render(<Toast toast={toast} onClose={vi.fn()} />);
      });

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('should use role="alert" for error toasts and role="status" for others', async () => {
      const errorToast: ToastType = {
        id: 'error',
        type: 'error',
        title: 'Error',
      };
      let rerender: ReturnType<typeof render>['rerender'];

      await act(async () => {
        const result = render(<Toast toast={errorToast} onClose={vi.fn()} />);
        rerender = result.rerender;
      });

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveAttribute(
        'aria-live',
        'assertive',
      );
      expect(screen.getByRole('alert')).toHaveAttribute('aria-atomic', 'true');

      const successToast: ToastType = {
        id: 'success',
        type: 'success',
        title: 'Success',
      };

      await act(async () => {
        rerender!(<Toast toast={successToast} onClose={vi.fn()} />);
      });

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
      expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
    });

    it('should call onClose when close button is clicked', async () => {
      const onClose = vi.fn();
      const toast: ToastType = {
        id: 'test-close',
        type: 'info',
        title: 'Info',
      };

      await act(async () => {
        render(<Toast toast={toast} onClose={onClose} />);
      });

      await act(async () => {
        const closeButton = screen.getByRole('button', { name: /close/i });
        closeButton.click();
      });

      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      expect(onClose).toHaveBeenCalledWith('test-close');
    });

    it('should call action onClick when action button is clicked', async () => {
      const actionOnClick = vi.fn();
      const toast: ToastType = {
        id: 'test-action',
        type: 'info',
        title: 'Action',
        action: {
          label: 'Confirm',
          onClick: actionOnClick,
        },
      };

      await act(async () => {
        render(<Toast toast={toast} onClose={vi.fn()} />);
      });

      await act(async () => {
        const actionButton = screen.getByRole('button', { name: /confirm/i });
        actionButton.click();
      });

      expect(actionOnClick).toHaveBeenCalled();
    });

    it('should auto-dismiss after duration', async () => {
      const onClose = vi.fn();
      const toast: ToastType = {
        id: 'test-duration',
        type: 'info',
        title: 'Info',
        duration: 1000,
      };

      await act(async () => {
        render(<Toast toast={toast} onClose={onClose} />);
      });

      expect(screen.getByRole('status')).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(1000);
        vi.advanceTimersByTime(200);
      });

      expect(onClose).toHaveBeenCalledWith('test-duration');
    });

    it('should not auto-dismiss when duration is null', async () => {
      const onClose = vi.fn();
      const toast: ToastType = {
        id: 'test-persistent',
        type: 'info',
        title: 'Info',
        duration: null,
      };

      await act(async () => {
        render(<Toast toast={toast} onClose={onClose} />);
      });

      expect(screen.getByRole('status')).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(10000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should link description to title with aria-labelledby', async () => {
      const toast: ToastType = {
        id: 'test-linked',
        type: 'info',
        title: 'Title',
        description: 'Description',
      };

      await act(async () => {
        render(<Toast toast={toast} onClose={vi.fn()} />);
      });

      const description = screen.getByText('Description');
      expect(description).toHaveAttribute(
        'aria-labelledby',
        'toast-title-test-linked',
      );
    });
  });

  describe('useToast Hook', () => {
    it('should add toast to stack', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        const id = result.current.addToast({
          type: 'success',
          title: 'Success',
        });
        expect(id).toBeDefined();
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('success');
    });

    it('should remove toast from stack', () => {
      const { result } = renderHook(() => useToast());
      let toastId: string;

      act(() => {
        toastId = result.current.addToast({
          type: 'info',
          title: 'Info',
        });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should clear all toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast({ type: 'info', title: 'Info 1' });
        result.current.addToast({ type: 'info', title: 'Info 2' });
        result.current.addToast({ type: 'info', title: 'Info 3' });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should call onClose callback when toast is removed', () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useToast());
      let toastId: string;

      act(() => {
        toastId = result.current.addToast({
          type: 'info',
          title: 'Info',
          onClose,
        });
      });

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(onClose).toHaveBeenCalled();
    });
  });
});
