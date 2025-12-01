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

  it('should have no accessibility violations with error state', async () => {
    const { container } = render(
      <TextField label="Email" error="Email is required" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with helper text', async () => {
    const { container } = render(
      <TextField label="Username" helperText="This is your public handle" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<TextField label="Locked Field" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible password toggle button', async () => {
    const { container } = render(
      <TextField label="Password" type="password" />,
    );

    const toggleButton = screen.getByRole('button', {
      name: /show password/i,
    });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-label', 'Show password');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Password Toggle Keyboard Navigation', () => {
    it('should toggle password visibility with Enter key', () => {
      render(<TextField label="Password" type="password" />);

      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });
      const input = screen.getByLabelText('Password') as HTMLInputElement;

      expect(input.type).toBe('password');
      toggleButton.focus();
      fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' });
      expect(input.type).toBe('text');
    });

    it('should toggle password visibility with Space key', () => {
      render(<TextField label="Password" type="password" />);

      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });
      const input = screen.getByLabelText('Password') as HTMLInputElement;

      expect(input.type).toBe('password');
      toggleButton.focus();
      fireEvent.keyDown(toggleButton, { key: ' ', code: 'Space' });
      expect(input.type).toBe('text');
    });

    it('should update aria-label when password is visible', () => {
      render(<TextField label="Password" type="password" />);

      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });
      fireEvent.click(toggleButton);

      expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
    });
  });

  it('should have aria-errormessage when error is present', () => {
    const errorMessage = 'Email is required.';
    render(<TextField label="Email" error={errorMessage} />);

    const input = screen.getByLabelText('Email');
    const errorElement = screen.getByText(errorMessage);

    expect(input).toHaveAttribute('aria-errormessage');
    expect(input.getAttribute('aria-errormessage')).toBe(
      errorElement.getAttribute('id'),
    );
  });

  it('should have no accessibility violations with error + disabled', async () => {
    const { container } = render(
      <TextField label="Email" error="Email is required" disabled />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with helper text + disabled', async () => {
    const { container } = render(
      <TextField
        label="Username"
        helperText="This is your public handle"
        disabled
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for password field with error', async () => {
    const { container } = render(
      <TextField
        label="Password"
        type="password"
        error="Password is required"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for password field when disabled', async () => {
    const { container } = render(
      <TextField label="Password" type="password" disabled />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for password field with helper text', async () => {
    const { container } = render(
      <TextField
        label="Password"
        type="password"
        helperText="Must be at least 8 characters"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for password field with visible password', async () => {
    const { container } = render(
      <TextField label="Password" type="password" />,
    );

    const toggleButton = screen.getByRole('button', {
      name: /show password/i,
    });
    fireEvent.click(toggleButton);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
