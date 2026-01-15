import React, { useId, useState, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './TextField.module.css';

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      id,
      type,
      showPasswordLabel,
      hidePasswordLabel,
      ...props
    },
    ref,
  ) => {
    const isPasswordField = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPasswordField
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className={cn(styles.container, className)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>

        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            aria-errormessage={error ? errorId : undefined}
            className={cn(styles.input, error && styles.errorInput)}
            {...props}
          />

          {isPasswordField && (
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => setShowPassword((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowPassword((prev) => !prev);
                }
              }}
              aria-label={
                showPassword
                  ? hidePasswordLabel || 'Hide password'
                  : showPasswordLabel || 'Show password'
              }
            >
              {showPassword ? '✕' : '◎'}
            </button>
          )}
        </div>

        {error && (
          <span id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}

        {!error && helperText && (
          <span
            id={helperId}
            className={styles.errorMessage}
            style={{ color: 'var(--a11y-gray-600)' }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
