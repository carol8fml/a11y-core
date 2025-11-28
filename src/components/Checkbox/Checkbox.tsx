import React, {
  forwardRef,
  useId,
  useImperativeHandle,
  useEffect,
} from 'react';
import { cn } from '../../utils/cn';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'onChange'
  > {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked = false,
      indeterminate = false,
      onCheckedChange,
      disabled,
      className,
      error,
      helperText,
      id,
      name,
      value,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;
    const helperId = `${checkboxId}-helper`;
    const describedBy = error
      ? errorId
      : helperText
        ? helperId
        : ariaDescribedBy || undefined;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onCheckedChange?.(event.target.checked);
    };

    const inputRef = React.useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === ' ' && disabled) {
        event.preventDefault();
      }
    };

    return (
      <div className={cn(styles.container, className)}>
        <label
          htmlFor={checkboxId}
          className={cn(styles.label, disabled && styles.labelDisabled)}
        >
          <input
            ref={inputRef}
            type="checkbox"
            id={checkboxId}
            name={name}
            value={value}
            checked={checked && !indeterminate}
            disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : checked ? 'true' : 'false'}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            aria-errormessage={error ? errorId : undefined}
            className={styles.input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...props}
          />
          <span
            className={cn(
              styles.checkbox,
              checked && styles.checked,
              indeterminate && styles.indeterminate,
              error && styles.error,
              disabled && styles.disabled,
            )}
            aria-hidden="true"
          >
            {indeterminate ? (
              <span className={styles.indeterminateMark}>−</span>
            ) : checked ? (
              <svg
                className={styles.checkmark}
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
          {label && <span className={styles.labelText}>{label}</span>}
        </label>
        {error && (
          <span id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
