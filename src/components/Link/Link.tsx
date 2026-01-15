import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import styles from './Link.module.css';

const linkVariants = cva(styles.base, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  external?: boolean;
  externalIcon?: React.ReactNode;
  iconPosition?: 'before' | 'after';
  'aria-label'?: string;
  externalLinkSrText?: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      size,
      external = false,
      href,
      children,
      target,
      rel,
      externalIcon,
      iconPosition = 'after',
      'aria-label': ariaLabel,
      externalLinkSrText,
      ...props
    },
    ref,
  ) => {
    const isExternal =
      external || (href && (href.startsWith('http') || href.startsWith('//')));

    const linkTarget = isExternal ? target || '_blank' : target;
    const linkRel = isExternal ? rel || 'noopener noreferrer' : rel;
    const finalAriaLabel = ariaLabel || undefined;
    const shouldShowSrText =
      isExternal && linkTarget === '_blank' && !ariaLabel && externalLinkSrText;

    const iconElement =
      isExternal && externalIcon ? (
        <span
          className={cn(
            styles.externalIcon,
            iconPosition === 'before' && styles.iconBefore,
          )}
          aria-hidden="true"
        >
          {externalIcon}
        </span>
      ) : null;

    return (
      <a
        ref={ref}
        href={href}
        target={linkTarget}
        rel={linkRel}
        className={cn(linkVariants({ variant, size }), className)}
        aria-label={finalAriaLabel}
        {...props}
      >
        {iconPosition === 'before' && iconElement}
        <span className={styles.linkText}>{children}</span>
        {iconPosition === 'after' && iconElement}
        {shouldShowSrText && (
          <span className={styles.srOnly}> {externalLinkSrText}</span>
        )}
      </a>
    );
  },
);

Link.displayName = 'Link';
