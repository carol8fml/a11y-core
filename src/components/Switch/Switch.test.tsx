import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Switch } from './Switch';

const mockOnCheckedChange = vi.fn();

beforeEach(() => {
  mockOnCheckedChange.mockClear();
});

expect.extend(toHaveNoViolations);

describe('Switch', () => {
  it('should render the switch and pass axe accessibility checks (OFF state)', async () => {
    const { container } = render(
      <Switch
        label="Airplane Mode"
        checked={false}
        onCheckedChange={mockOnCheckedChange}
      />,
    );

    const switchElement = screen.getByRole('switch', { name: 'Airplane Mode' });
    expect(switchElement).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render the switch and pass axe accessibility checks (ON state)', async () => {
    const { container } = render(
      <Switch
        label="Notifications"
        checked={true}
        onCheckedChange={mockOnCheckedChange}
      />,
    );

    const switchElement = screen.getByRole('switch', { name: 'Notifications' });
    expect(switchElement).toHaveAttribute('aria-checked', 'true');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should call onCheckedChange when clicked', () => {
    render(
      <Switch
        label="Toggle"
        checked={false}
        onCheckedChange={mockOnCheckedChange}
      />,
    );

    const switchElement = screen.getByRole('switch', { name: 'Toggle' });
    fireEvent.click(switchElement);

    expect(mockOnCheckedChange).toHaveBeenCalledTimes(1);
  });

  it('should not call onCheckedChange when disabled', () => {
    render(
      <Switch
        label="Disabled Switch"
        checked={false}
        onCheckedChange={mockOnCheckedChange}
        disabled
      />,
    );

    const switchElement = screen.getByRole('switch', {
      name: 'Disabled Switch',
    });

    expect(switchElement).toBeDisabled();

    fireEvent.click(switchElement);

    expect(mockOnCheckedChange).not.toHaveBeenCalled();
  });

  it('should render the switch and pass axe accessibility checks (disabled state)', async () => {
    const { container } = render(
      <Switch
        label="Disabled Switch"
        checked={false}
        onCheckedChange={mockOnCheckedChange}
        disabled
      />,
    );

    const switchElement = screen.getByRole('switch', {
      name: 'Disabled Switch',
    });
    expect(switchElement).toBeDisabled();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render the switch and pass axe accessibility checks (checked + disabled)', async () => {
    const { container } = render(
      <Switch
        label="Disabled Checked Switch"
        checked={true}
        onCheckedChange={mockOnCheckedChange}
        disabled
      />,
    );

    const switchElement = screen.getByRole('switch', {
      name: 'Disabled Checked Switch',
    });
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveAttribute('aria-checked', 'true');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be accessible with only aria-label', async () => {
    const { container } = render(
      <Switch
        aria-label="Toggle notifications"
        checked={false}
        onCheckedChange={mockOnCheckedChange}
      />,
    );
    const switchElement = screen.getByRole('switch', {
      name: /toggle notifications/i,
    });
    expect(switchElement).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
