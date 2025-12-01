import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Component: Button', () => {
  it('should render and be found by its accessible name', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should have no accessibility violations (default state - primary + md)', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should apply disabled attributes correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should pass accessibility checks for outline variant + small size', async () => {
    const { container } = render(
      <Button variant="outline" size="sm">
        Small Outline
      </Button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should pass accessibility checks for outline variant + medium size', async () => {
    const { container } = render(
      <Button variant="outline" size="md">
        Medium Outline
      </Button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should pass accessibility checks for primary variant + small size', async () => {
    const { container } = render(
      <Button variant="primary" size="sm">
        Small Primary
      </Button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should pass accessibility checks for button with type="submit"', async () => {
    const { container } = render(<Button type="submit">Submit Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should pass accessibility checks for button with type="reset"', async () => {
    const { container } = render(<Button type="reset">Reset Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Keyboard Navigation', () => {
    it('should handle Enter key', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle Space key', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      button.focus();
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger onClick when disabled and Enter is pressed', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>,
      );

      const button = screen.getByRole('button', { name: /disabled/i });
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should be accessible with only aria-label', async () => {
      const { container } = render(
        <Button aria-label="Close dialog">×</Button>,
      );
      const button = screen.getByRole('button', { name: /close dialog/i });
      expect(button).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
