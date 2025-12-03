import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import '../../styles/tokens.css';

const meta: Meta<typeof Link> = {
  title: 'Core/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style variant of the link',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Size of the link text',
    },
    external: {
      control: 'boolean',
      description:
        'Whether this is an external link (adds icon and security attributes)',
    },
    externalIcon: {
      control: false,
      description:
        'Custom icon to display for external links. If not provided, a default icon will be used.',
    },
    iconPosition: {
      control: 'radio',
      options: ['before', 'after'],
      description: 'Position of the external link icon relative to the text',
      if: { arg: 'externalIcon', exists: true },
    },
    href: {
      control: 'text',
      description: 'URL or path the link points to',
    },
    children: {
      control: 'text',
      description: 'Link text content',
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible label for the link (useful when text alone is insufficient)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/',
    children: 'Link',
  },
};

export const Secondary: Story = {
  args: {
    href: '/home',
    variant: 'secondary',
    children: 'Secondary Link',
  },
};

export const WithIcon: Story = {
  args: {
    href: '/',
    children: 'Link with Icon',
    external: true,
    externalIcon: (
      <span role="img" aria-label="external link">
        🔗
      </span>
    ),
    iconPosition: 'after',
  },
};

export const External: Story = {
  args: {
    href: '/',
    children: 'External Link',
    external: true,
  },
};
