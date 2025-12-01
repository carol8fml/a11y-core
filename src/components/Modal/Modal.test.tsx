import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

expect.extend(toHaveNoViolations);

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('Component: Modal', () => {
  const MODAL_TITLE_ID = 'test-modal-title';
  const MODAL_DESCRIPTION_ID = 'test-modal-description';

  describe('Accessibility (Axe)', () => {
    it('should have no accessibility violations - basic modal with all features', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>
              <p>Modal content</p>
            </div>
            <Modal.Footer
              cancelButton={{ label: 'Cancel' }}
              confirmButton={{ label: 'Confirm', onClick: onClose }}
            />
          </Modal.Content>
        </Modal.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - modal with description', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content
            titleId={MODAL_TITLE_ID}
            descriptionId={MODAL_DESCRIPTION_ID}
          >
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>
              <p id={MODAL_DESCRIPTION_ID}>Modal description</p>
              <p>Modal content</p>
            </div>
            <Modal.Footer
              cancelButton={{ label: 'Cancel' }}
              confirmButton={{ label: 'Confirm', onClick: onClose }}
            />
          </Modal.Content>
        </Modal.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - modal without close button', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID} showCloseButton={false}>
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>
              <p>Modal content</p>
            </div>
            <Modal.Footer
              cancelButton={{ label: 'Cancel' }}
              confirmButton={{ label: 'Confirm', onClick: onClose }}
            />
          </Modal.Content>
        </Modal.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - modal with only cancel button', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>
              <p>Modal content</p>
            </div>
            <Modal.Footer
              cancelButton={{ label: 'Cancel' }}
              confirmButton={{ show: false }}
            />
          </Modal.Content>
        </Modal.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - modal with only confirm button', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>
              <p>Modal content</p>
            </div>
            <Modal.Footer
              cancelButton={{ show: false }}
              confirmButton={{ label: 'Confirm', onClick: onClose }}
            />
          </Modal.Content>
        </Modal.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - modal without footer', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>
              <p>Modal content without footer</p>
            </div>
          </Modal.Content>
        </Modal.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - modal without header', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
            <h2 id={MODAL_TITLE_ID}>Title outside header</h2>
            <div>
              <p>Modal content without header component</p>
            </div>
            <Modal.Footer
              cancelButton={{ label: 'Cancel' }}
              confirmButton={{ label: 'Confirm', onClick: onClose }}
            />
          </Modal.Content>
        </Modal.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - modal with custom footer children', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>
              <p>Modal content</p>
            </div>
            <Modal.Footer>
              <button type="button">Custom Button</button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have correct ARIA attributes on dialog', () => {
      const onClose = vi.fn();
      render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>Content</div>
          </Modal.Content>
        </Modal.Root>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', MODAL_TITLE_ID);
      expect(dialog).toHaveAttribute('tabIndex', '-1');
    });

    it('should have aria-describedby when descriptionId is provided', () => {
      const onClose = vi.fn();
      render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content
            titleId={MODAL_TITLE_ID}
            descriptionId={MODAL_DESCRIPTION_ID}
          >
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>
              <p id={MODAL_DESCRIPTION_ID}>Description</p>
            </div>
          </Modal.Content>
        </Modal.Root>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', MODAL_DESCRIPTION_ID);
    });

    it('should have accessible buttons with proper labels and types', () => {
      const onClose = vi.fn();
      render(
        <Modal.Root isOpen={true} onClose={onClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Test Modal</Modal.Title>
            </Modal.Header>
            <div>Content</div>
            <Modal.Footer
              cancelButton={{ label: 'Cancel' }}
              confirmButton={{ label: 'Confirm', onClick: onClose }}
            />
          </Modal.Content>
        </Modal.Root>,
      );

      const closeButton = screen.getByRole('button', { name: /close dialog/i });
      expect(closeButton).toHaveAttribute('type', 'button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close dialog');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toHaveAttribute('type', 'button');

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toHaveAttribute('type', 'button');
    });
  });
});
