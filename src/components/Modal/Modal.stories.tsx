import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';

const MODAL_TITLE_ID = 'example-dialog-title';

const meta: Meta<typeof Modal.Root> = {
  title: 'Core/Modal',
  component: Modal.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is open or closed.',
    },
    onClose: { action: 'onClose called', table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Modal.Root>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    return (
      <>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>

        <Modal.Root isOpen={isOpen} onClose={handleClose}>
          <Modal.Content titleId={MODAL_TITLE_ID}>
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
              cancelButton={{
                label: 'Cancel',
              }}
              confirmButton={{
                label: 'Confirm',
                onClick: () => {
                  alert('Action Confirmed!');
                  handleClose();
                },
              }}
            />
          </Modal.Content>
        </Modal.Root>
      </>
    );
  },
};
