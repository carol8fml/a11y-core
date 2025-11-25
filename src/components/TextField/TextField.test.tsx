import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { TextField } from './TextField';

expect.extend(toHaveNoViolations);

describe('Component: TextField', () => {
  it('should render and link label to input correctly', async () => {
    render(<TextField label="Full Name" placeholder="Enter name" />);

    const input = screen.getByLabelText('Full Name');

    expect(input).toBeInTheDocument();

    const { container } = render(<TextField label="A11y Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should update value when user types', () => {
    render(<TextField label="Email" />);

    const input = screen.getByLabelText('Email') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'carol@dev.com' } });

    expect(input.value).toBe('carol@dev.com');
  });

  it('should link error message using aria-describedby and set aria-invalid', () => {
    const errorMessage = 'Email is required.';
    render(<TextField label="Email" error={errorMessage} />);

    const input = screen.getByLabelText('Email');
    const errorElement = screen.getByText(errorMessage);

    expect(input).toHaveAttribute('aria-invalid', 'true');

    const errorId = errorElement.getAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', errorId);

    expect(errorElement).toHaveAttribute('role', 'alert');
  });

  it('should link helper text using aria-describedby when no error is present', () => {
    const helperText = 'This is your public handle.';
    render(<TextField label="Username" helperText={helperText} />);

    const input = screen.getByLabelText('Username');
    const helperElement = screen.getByText(helperText);

    const helperId = helperElement.getAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', helperId);

    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('should apply disabled attribute correctly', () => {
    render(<TextField label="Locked Field" disabled />);

    const input = screen.getByLabelText('Locked Field');
    expect(input).toBeDisabled();
  });
});
