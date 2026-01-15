import type { Meta, StoryObj } from '@storybook/react';
import { ToastContainer } from './Toast';
import { useToast } from './hooks/useToast';
import type { ToastType, ToastPosition } from './hooks/useToast';
import { Button } from '../Button';
import '../../styles/tokens.css';

const ToastDemo = ({
  type,
  position,
  title,
  description,
  duration,
  hasAction,
}: {
  type?: ToastType;
  position?: ToastPosition;
  title?: string;
  description?: string;
  duration?: number | null;
  hasAction?: boolean;
}) => {
  const { toasts, addToast, removeToast } = useToast();

  const handleAddToast = () => {
    addToast({
      type: type || 'info',
      title: title || 'Notification',
      description: description || 'This is a toast notification message.',
      duration: duration !== undefined ? duration : 5000,
      ...(hasAction && {
        action: {
          label: 'Confirm',
          onClick: () => {
            console.log('Action confirmed');
          },
        },
      }),
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <Button onClick={handleAddToast}>Show Toast</Button>
      </div>
      <ToastContainer
        toasts={toasts}
        position={position || 'top-right'}
        onClose={removeToast}
      />
    </div>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: 'Core/Toast',
  component: ToastDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Type of toast notification',
    },
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Position of the toast on the screen',
    },
    title: {
      control: 'text',
      description: 'Title of the toast',
    },
    description: {
      control: 'text',
      description: 'Description message of the toast',
    },
    duration: {
      control: 'number',
      description:
        'Duration in milliseconds before auto-dismiss (null for persistent)',
    },
    hasAction: {
      control: 'boolean',
      description: 'Whether the toast has an action button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'info',
    position: 'top-right',
    title: 'Notification',
    description: 'This is a toast notification message.',
    duration: 5000,
    hasAction: false,
  },
};
