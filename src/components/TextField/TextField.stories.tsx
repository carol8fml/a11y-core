import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';
import '../../styles/tokens.css';

const meta: Meta<typeof TextField> = {
  title: 'Core/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'name@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    defaultValue: '123',
    error: 'Password must be at least 8 characters',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: '@username',
    helperText: 'This will be your public handle.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Profile ID',
    defaultValue: 'User-8821',
    disabled: true,
  },
};