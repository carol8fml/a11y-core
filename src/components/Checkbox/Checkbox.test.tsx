import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Checkbox } from './Checkbox';

const mockOnCheckedChange = vi.fn();

beforeEach(() => {
  mockOnCheckedChange.mockClear();
});

expect.extend(toHaveNoViolations);

describe('Component: Checkbox', () => {
  describe('Accessibility (Axe)', () => {
    it('should have no accessibility violations - unchecked state', async () => {
      const { container } = render(
        <Checkbox
          label="Accept terms"
          checked={false}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - checked state', async () => {
      const { container } = render(
        <Checkbox
          label="Subscribe to newsletter"
          checked={true}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - indeterminate state', async () => {
      const { container } = render(
        <Checkbox
          label="Select all"
          checked={false}
          indeterminate={true}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - disabled state', async () => {
      const { container } = render(
        <Checkbox
          label="Disabled option"
          checked={false}
          disabled
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with error', async () => {
      const { container } = render(
        <Checkbox
          label="Accept terms"
          checked={false}
          error="You must accept the terms"
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with helper text', async () => {
      const { container } = render(
        <Checkbox
          label="Subscribe"
          checked={false}
          helperText="You can unsubscribe at any time"
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - without label', async () => {
      const { container } = render(
        <Checkbox
          checked={false}
          aria-label="Custom checkbox"
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Functionality', () => {
    it('should render checkbox with label', () => {
      render(
        <Checkbox
          label="Accept terms"
          checked={false}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
      expect(checkbox).toBeInTheDocument();
    });

    it('should call onCheckedChange when clicked', () => {
      render(
        <Checkbox
          label="Toggle"
          checked={false}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /toggle/i });
      fireEvent.click(checkbox);

      expect(mockOnCheckedChange).toHaveBeenCalledTimes(1);
      expect(mockOnCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should toggle from checked to unchecked', () => {
      render(
        <Checkbox
          label="Toggle"
          checked={true}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /toggle/i });
      fireEvent.click(checkbox);

      expect(mockOnCheckedChange).toHaveBeenCalledWith(false);
    });

    it('should not call onCheckedChange when disabled', () => {
      render(
        <Checkbox
          label="Disabled"
          checked={false}
          disabled
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /disabled/i });
      expect(checkbox).toBeDisabled();

      fireEvent.click(checkbox);
      expect(mockOnCheckedChange).not.toHaveBeenCalled();
    });

    it('should handle keyboard interaction (Space)', () => {
      render(
        <Checkbox
          label="Keyboard test"
          checked={false}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', {
        name: /keyboard test/i,
      });
      checkbox.focus();
      fireEvent.keyDown(checkbox, { key: ' ', code: 'Space' });
      fireEvent.change(checkbox, { target: { checked: true } });
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('ARIA Attributes', () => {
    it('should have correct aria-checked attribute when checked', () => {
      render(
        <Checkbox
          label="Checked"
          checked={true}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /checked/i });
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('should have correct aria-checked attribute when unchecked', () => {
      render(
        <Checkbox
          label="Unchecked"
          checked={false}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /unchecked/i });
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('should have aria-checked="mixed" when indeterminate', () => {
      render(
        <Checkbox
          label="Indeterminate"
          checked={false}
          indeterminate={true}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', {
        name: /indeterminate/i,
      });
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    it('should have aria-invalid when error is present', () => {
      render(
        <Checkbox
          label="Error test"
          checked={false}
          error="Error message"
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /error test/i });
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });

    it('should link error message using aria-describedby', () => {
      const errorMessage = 'You must accept the terms';
      render(
        <Checkbox
          label="Terms"
          checked={false}
          error={errorMessage}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /terms/i });
      const errorElement = screen.getByText(errorMessage);

      expect(errorElement).toHaveAttribute('role', 'alert');
      expect(checkbox).toHaveAttribute('aria-describedby');
      expect(checkbox.getAttribute('aria-describedby')).toBe(
        errorElement.getAttribute('id'),
      );
    });

    it('should link helper text using aria-describedby', () => {
      const helperText = 'You can unsubscribe at any time';
      render(
        <Checkbox
          label="Subscribe"
          checked={false}
          helperText={helperText}
          onCheckedChange={mockOnCheckedChange}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /subscribe/i });
      const helperElement = screen.getByText(helperText);

      expect(checkbox).toHaveAttribute('aria-describedby');
      expect(checkbox.getAttribute('aria-describedby')).toBe(
        helperElement.getAttribute('id'),
      );
    });
  });

  describe('Select All Behavior', () => {
    it('should handle select all when none are selected', () => {
      const mockSelectAll = vi.fn();
      render(
        <Checkbox
          label="Select all"
          checked={false}
          indeterminate={false}
          onCheckedChange={mockSelectAll}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /select all/i });
      fireEvent.click(checkbox);

      expect(mockSelectAll).toHaveBeenCalledTimes(1);
      expect(mockSelectAll).toHaveBeenCalledWith(true);
    });

    it('should handle select all when all are selected', () => {
      const mockSelectAll = vi.fn();
      render(
        <Checkbox
          label="Select all"
          checked={true}
          indeterminate={false}
          onCheckedChange={mockSelectAll}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /select all/i });
      fireEvent.click(checkbox);

      expect(mockSelectAll).toHaveBeenCalledTimes(1);
      expect(mockSelectAll).toHaveBeenCalledWith(false);
    });

    it('should handle select all when in indeterminate state', () => {
      const mockSelectAll = vi.fn();
      render(
        <Checkbox
          label="Select all"
          checked={false}
          indeterminate={true}
          onCheckedChange={mockSelectAll}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /select all/i });
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');

      fireEvent.click(checkbox);

      expect(mockSelectAll).toHaveBeenCalledTimes(1);
      expect(mockSelectAll).toHaveBeenCalledWith(true);
    });

    it('should be clickable via label when checkbox is indeterminate', () => {
      const mockSelectAll = vi.fn();
      render(
        <Checkbox
          label="Select all"
          checked={false}
          indeterminate={true}
          onCheckedChange={mockSelectAll}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /select all/i });
      fireEvent.click(checkbox);

      expect(mockSelectAll).toHaveBeenCalledTimes(1);
      expect(mockSelectAll).toHaveBeenCalledWith(true);
    });

    it('should be clickable via label when checkbox is indeterminate and all selected', () => {
      const mockSelectAll = vi.fn();
      render(
        <Checkbox
          label="Select all"
          checked={true}
          indeterminate={false}
          onCheckedChange={mockSelectAll}
        />,
      );

      const checkbox = screen.getByRole('checkbox', { name: /select all/i });
      fireEvent.click(checkbox);

      expect(mockSelectAll).toHaveBeenCalledTimes(1);
      expect(mockSelectAll).toHaveBeenCalledWith(false);
    });
  });
});
