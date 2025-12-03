import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { Link, type LinkProps } from './Link';

expect.extend(toHaveNoViolations);

describe('Component: Link', () => {
  describe('Accessibility (Axe)', () => {
    it('should have no accessibility violations - default', async () => {
      const { container } = render(<Link href="/home">Link</Link>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it.each([
      ['primary', 'sm'],
      ['primary', 'md'],
      ['secondary', 'sm'],
      ['secondary', 'md'],
    ] as const)(
      'should have no accessibility violations - %s variant + %s size',
      async (variant, size) => {
        const { container } = render(
          <Link
            href="/home"
            variant={variant as LinkProps['variant']}
            size={size as LinkProps['size']}
          >
            Link
          </Link>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      },
    );

    it('should have no accessibility violations - internal link', async () => {
      const { container } = render(<Link href="/internal">Internal</Link>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it.each([
      ['external prop', { href: '/internal', external: true }],
      ['https://', { href: 'https://example.com' }],
      ['http://', { href: 'http://example.com' }],
      ['//', { href: '//example.com' }],
    ])(
      'should have no accessibility violations - external link (%s)',
      async (_, props) => {
        const { container } = render(<Link {...props}>External</Link>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      },
    );

    it('should have no accessibility violations - with custom aria-label', async () => {
      const { container } = render(
        <Link href="/home" aria-label="Navigate to home">
          →
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - external with custom aria-label', async () => {
      const { container } = render(
        <Link href="https://example.com" aria-label="Visit website">
          External
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with custom target and rel', async () => {
      const { container } = render(
        <Link href="https://example.com" target="_self" rel="nofollow">
          Link
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with HTML anchor attributes', async () => {
      const { container } = render(
        <Link
          href="/download"
          download="file.pdf"
          hrefLang="en"
          type="application/pdf"
        >
          Download
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with custom className', async () => {
      const { container } = render(
        <Link href="/home" className="custom">
          Link
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with disabled state', async () => {
      const { container } = render(
        <Link href="/home" aria-disabled="true">
          Link
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with custom external icon', async () => {
      const { container } = render(
        <Link
          href="https://example.com"
          externalIcon={<span aria-hidden="true">↗</span>}
        >
          External
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with icon before', async () => {
      const { container } = render(
        <Link href="https://example.com" iconPosition="before">
          External
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with icon after', async () => {
      const { container } = render(
        <Link href="https://example.com" iconPosition="after">
          External
        </Link>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Functionality', () => {
    it('should render with accessible name', () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole('link', { name: /about/i });
      expect(link).toHaveAttribute('href', '/about');
    });

    it.each([
      ['https://example.com'],
      ['http://example.com'],
      ['//example.com'],
    ])('should auto-detect external link from %s', (href) => {
      render(<Link href={href}>External</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should add external attributes when external prop is true', () => {
      render(
        <Link href="/internal" external>
          External
        </Link>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not add icon for external links without externalIcon prop', () => {
      render(<Link href="https://example.com">External</Link>);
      const link = screen.getByRole('link');
      const icon = link.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('should use custom external icon when provided', () => {
      const CustomIcon = () => <span data-testid="custom-icon">↗</span>;
      render(
        <Link href="https://example.com" externalIcon={<CustomIcon />}>
          External
        </Link>,
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(
        screen.getByRole('link').querySelector('svg'),
      ).not.toBeInTheDocument();
    });

    it('should not show icon when externalIcon is not provided', () => {
      render(<Link href="https://example.com">External</Link>);
      expect(
        screen.getByRole('link').querySelector('svg'),
      ).not.toBeInTheDocument();
    });

    it('should use custom aria-label when provided', () => {
      render(
        <Link href="/home" aria-label="Custom">
          Link
        </Link>,
      );
      expect(screen.getByRole('link', { name: /custom/i })).toHaveAttribute(
        'aria-label',
        'Custom',
      );
    });

    it('should not auto-generate aria-label for external links', () => {
      render(<Link href="https://example.com">External</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('aria-label');
    });

    it('should not add external attributes for internal links', () => {
      render(<Link href="/internal">Internal</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
      expect(link).not.toHaveAttribute('aria-label');
    });

    it('should respect custom target and rel props', () => {
      render(
        <Link href="https://example.com" target="_self" rel="nofollow">
          Link
        </Link>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_self');
      expect(link).toHaveAttribute('rel', 'nofollow');
    });

    it('should support HTML anchor attributes', () => {
      render(
        <Link href="/download" download="file.pdf" hrefLang="en">
          Download
        </Link>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('download', 'file.pdf');
      expect(link).toHaveAttribute('hreflang', 'en');
    });

    it.each([
      ['primary', 'primary'],
      ['secondary', 'secondary'],
    ] as const)('should apply %s variant class', (variant, expectedClass) => {
      render(
        <Link href="/home" variant={variant as LinkProps['variant']}>
          Link
        </Link>,
      );
      expect(screen.getByRole('link').className).toContain(expectedClass);
    });

    it.each([
      ['sm', 'sm'],
      ['md', 'md'],
    ] as const)('should apply %s size class', (size, expectedClass) => {
      render(
        <Link href="/home" size={size as LinkProps['size']}>
          Link
        </Link>,
      );
      expect(screen.getByRole('link').className).toContain(expectedClass);
    });

    it('should merge custom className', () => {
      render(
        <Link href="/home" className="custom">
          Link
        </Link>,
      );
      const link = screen.getByRole('link');
      expect(link.className).toContain('custom');
      expect(link.className).toContain('primary');
    });

    it('should position icon before text when iconPosition is before', () => {
      render(
        <Link
          href="https://example.com"
          iconPosition="before"
          externalIcon={<span data-testid="icon">↗</span>}
        >
          External
        </Link>,
      );
      const link = screen.getByRole('link');
      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(link.firstChild).toBe(icon.parentElement);
    });

    it('should position icon after text when iconPosition is after', () => {
      render(
        <Link
          href="https://example.com"
          iconPosition="after"
          externalIcon={<span data-testid="icon">↗</span>}
        >
          External
        </Link>,
      );
      const link = screen.getByRole('link');
      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(link.lastChild).toBe(icon.parentElement);
    });

    it('should default to icon after when iconPosition is not specified', () => {
      render(
        <Link
          href="https://example.com"
          externalIcon={<span data-testid="icon">↗</span>}
        >
          External
        </Link>,
      );
      const link = screen.getByRole('link');
      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(link.lastChild).toBe(icon.parentElement);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be keyboard accessible', () => {
      render(<Link href="/home">Link</Link>);
      const link = screen.getByRole('link');
      link.focus();
      expect(link).toHaveFocus();
    });

    it('should be naturally focusable', () => {
      render(<Link href="/home">Link</Link>);
      expect(screen.getByRole('link')).not.toHaveAttribute('tabindex');
    });
  });

  describe('External Link Accessibility', () => {
    it('should show external icon when externalIcon is provided', () => {
      const { container } = render(
        <Link
          href="https://example.com"
          externalIcon={<span data-testid="icon">↗</span>}
        >
          External
        </Link>,
      );
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('aria-label');
      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(
        container.querySelector('[class*="srOnly"]'),
      ).not.toBeInTheDocument();
    });

    it('should not include screen reader text for internal links', () => {
      const { container } = render(<Link href="/internal">Internal</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('aria-label');
      expect(
        container.querySelector('[class*="srOnly"]'),
      ).not.toBeInTheDocument();
    });
  });
});
