import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';

const MODAL_TITLE_ID = 'example-dialog-title';

interface StoryArgs {
  showCloseButton: boolean;
  showCancelButton: boolean;
  showConfirmButton: boolean;
  onClose: () => void;
}

const meta: Meta<StoryArgs> = {
  title: 'Core/Modal',
  component: Modal.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showCloseButton: {
      control: 'boolean',
      description: 'Show/hide the close button (X) in the top right corner.',
      defaultValue: true,
    },
    showCancelButton: {
      control: 'boolean',
      description: 'Show/hide the cancel button in the footer.',
      defaultValue: true,
    },
    showConfirmButton: {
      control: 'boolean',
      description: 'Show/hide the confirm button in the footer.',
      defaultValue: true,
    },
    onClose: { action: 'onClose called', table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    return (
      <>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>

        <Modal.Root isOpen={isOpen} onClose={handleClose}>
          <Modal.Content
            titleId={MODAL_TITLE_ID}
            showCloseButton={args.showCloseButton}
          >
            <Modal.Header>
              <Modal.Title id={MODAL_TITLE_ID}>Modal Title</Modal.Title>
            </Modal.Header>

            <div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--a11y-gray-600)',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                This is the modal content. You can customize the footer buttons
                or hide them completely. Try removing the Footer component or
                setting show: false on the buttons.
              </p>
            </div>

            <Modal.Footer
              cancelButton={
                args.showCancelButton
                  ? {
                      label: 'Cancel',
                    }
                  : { show: false }
              }
              confirmButton={
                args.showConfirmButton
                  ? {
                      label: 'Confirm',
                      onClick: () => {
                        alert('Action Confirmed!');
                        handleClose();
                      },
                    }
                  : { show: false }
              }
            />
          </Modal.Content>
        </Modal.Root>
      </>
    );
  },
  args: {
    showCloseButton: true,
    showCancelButton: true,
    showConfirmButton: true,
  },
};
