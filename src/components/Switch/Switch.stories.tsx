import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';
import { Button } from '../Button';
import '../../styles/tokens.css';

const meta: Meta<typeof Switch> = {
  title: 'Core/Switch',
  component: Switch,
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
    label: 'Airplane Mode',
    checked: false,
  },
  render: (args) => {
    const [isChecked, setIsChecked] = useState(args.checked);
    return (
      <Switch {...args} checked={isChecked} onCheckedChange={setIsChecked} />
    );
  },
};

export const FormIntegration: Story = {
  args: {
    label: 'Subscribe to Weekly Newsletter',
    name: 'newsletter',
    value: 'true',
  },
  render: (args) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);

      alert(`Data sent to the backend:\n\n${JSON.stringify(data, null, 2)}`);
      console.log('Form Data:', data);
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{
          width: '400px',
          padding: '24px',
          backgroundColor: 'var(--a11y-bg-surface)',
          border: '1px solid var(--a11y-gray-200)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid var(--a11y-gray-200)',
            paddingBottom: '16px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontFamily: 'var(--a11y-font-family)',
              color: 'var(--a11y-text-main)',
            }}
          >
            Email Preferences
          </h3>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '14px',
              color: 'var(--a11y-gray-600)',
              fontFamily: 'var(--a11y-font-family)',
            }}
          >
            Manage what emails you receive from us.
          </p>
        </div>

        <input type="hidden" name={args.name} value="false" />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Switch
            {...args}
            checked={isChecked}
            onCheckedChange={setIsChecked}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '8px',
          }}
        >
          <Button type="submit" variant="primary" size="sm">
            Save Changes
          </Button>
        </div>
      </form>
    );
  },
};

export const Disabled: Story = {
  args: {
    label: 'Bluetooth',
    checked: false,
    disabled: true,
  },
};
