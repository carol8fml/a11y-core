import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Switch.module.css';

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      label,
      checked = false,
      onCheckedChange,
      disabled,
      className,
      name,
      value = 'on',
      ...props
    },
    ref,
  ) => {
    const toggle = () => {
      if (!disabled) {
        onCheckedChange?.(!checked);
      }
    };

    return (
      <label
        className={cn(styles.container, className)}
        aria-disabled={disabled}
      >
        {name && (
          <input
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            readOnly
            style={{ display: 'none' }}
            aria-hidden="true"
          />
        )}

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          ref={ref}
          onClick={toggle}
          className={styles.switchBase}
          {...props}
        >
          <span className={styles.thumb} />
        </button>

        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
