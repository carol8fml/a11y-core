import React, { useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './TextField.module.css';

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
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
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(styles.input, error && styles.errorInput)}
            {...props}
          />
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
