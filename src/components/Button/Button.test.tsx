import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Component: Button', () => {
  it('should render and be found by its accessible name', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should have no accessibility violations (default state)', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should pass accessibility checks for outline variant', async () => {
    const { container } = render(
      <Button variant="outline">Outline Button</Button>,
    );
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

  it('should pass accessibility checks for primary variant', async () => {
    const { container } = render(
      <Button variant="primary">Primary Button</Button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should pass accessibility checks for small size', async () => {
    const { container } = render(<Button size="sm">Small Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should pass accessibility checks for medium size', async () => {
    const { container } = render(<Button size="md">Medium Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
