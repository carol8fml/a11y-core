import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Core/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description:
        'Label text displayed next to the checkbox. If not provided, use `aria-label` for accessibility.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    checked: {
      control: 'boolean',
      description:
        'Controls whether the checkbox is checked. Use `onCheckedChange` to handle state changes.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description:
        'Sets the checkbox to indeterminate state (shows a dash). Useful for "Select all" scenarios.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox, preventing user interaction.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'text',
      description:
        'Error message displayed below the checkbox. Sets `aria-invalid="true"` automatically.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    helperText: {
      control: 'text',
      description:
        'Helper text displayed below the checkbox. Only shown when `error` is not provided.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onCheckedChange: {
      action: 'checked changed',
      description:
        'Callback fired when the checkbox state changes. Receives the new `checked` value.',
      table: {
        type: { summary: '(checked: boolean) => void' },
        category: 'Events',
      },
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submission.',
      table: {
        type: { summary: 'string' },
        category: 'Form',
      },
    },
    value: {
      control: 'text',
      description: 'Value attribute for form submission.',
      table: {
        type: { summary: 'string' },
        category: 'Form',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Docs: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked || false);

    useEffect(() => {
      setChecked(args.checked || false);
    }, [args.checked]);

    return (
      <Checkbox
        {...args}
        checked={checked}
        onCheckedChange={(newChecked) => {
          setChecked(newChecked);
          args.onCheckedChange?.(newChecked);
        }}
      />
    );
  },
  args: {
    label: 'Accept terms and conditions',
    checked: false,
    disabled: false,
    indeterminate: false,
  },
};

export const Examples: Story = {
  render: () => {
    const [states, setStates] = useState({
      unchecked: false,
      checked: true,
      indeterminateState: 'indeterminate' as
        | 'unchecked'
        | 'checked'
        | 'indeterminate',
      withError: false,
      withHelper: false,
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontFamily: 'var(--a11y-font-family)',
              fontWeight: 'var(--a11y-font-weight-bold)',
            }}
          >
            Different States (All Interactive)
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <Checkbox
              label="Unchecked"
              checked={states.unchecked}
              onCheckedChange={(checked) =>
                setStates({ ...states, unchecked: checked })
              }
            />
            <Checkbox
              label="Checked"
              checked={states.checked}
              onCheckedChange={(checked) =>
                setStates({ ...states, checked: checked })
              }
            />
            <div>
              <Checkbox
                label="Indeterminate (click to toggle)"
                checked={states.indeterminateState === 'checked'}
                indeterminate={states.indeterminateState === 'indeterminate'}
                onCheckedChange={() => {
                  if (states.indeterminateState === 'indeterminate') {
                    setStates({ ...states, indeterminateState: 'checked' });
                  } else if (states.indeterminateState === 'checked') {
                    setStates({ ...states, indeterminateState: 'unchecked' });
                  } else {
                    setStates({
                      ...states,
                      indeterminateState: 'indeterminate',
                    });
                  }
                }}
              />
              <p
                style={{
                  margin: '4px 0 0 28px',
                  fontSize: '12px',
                  color: 'var(--a11y-gray-600)',
                  fontFamily: 'var(--a11y-font-family)',
                }}
              >
                Current state: {states.indeterminateState}
              </p>
            </div>
            <Checkbox label="Disabled unchecked" checked={false} disabled />
            <Checkbox label="Disabled checked" checked={true} disabled />
            <Checkbox
              label="With error"
              checked={states.withError}
              error="You must accept the terms"
              onCheckedChange={(checked) =>
                setStates({ ...states, withError: checked })
              }
            />
            <Checkbox
              label="With helper text"
              checked={states.withHelper}
              helperText="You can unsubscribe at any time"
              onCheckedChange={(checked) =>
                setStates({ ...states, withHelper: checked })
              }
            />
          </div>
        </div>
      </div>
    );
  },
};

export const SelectAll: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);

    const options = [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' },
      { id: '3', label: 'Option 3' },
    ];

    const handleChange = (id: string, checked: boolean) => {
      if (checked) {
        setSelected([...selected, id]);
      } else {
        setSelected(selected.filter((item) => item !== id));
      }
    };

    const allSelected = selected.length === options.length;
    const someSelected =
      selected.length > 0 && selected.length < options.length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Checkbox
          label="Select all"
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={(checked) => {
            console.log('Select all clicked', {
              checked,
              allSelected,
              someSelected,
            });
            if (checked) {
              setSelected(options.map((opt) => opt.id));
            } else {
              setSelected([]);
            }
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginLeft: '28px',
          }}
        >
          {options.map((option) => (
            <Checkbox
              key={option.id}
              label={option.label}
              checked={selected.includes(option.id)}
              onCheckedChange={(checked) => handleChange(option.id, checked)}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'var(--a11y-font-family)',
          }}
        >
          <strong>Debug:</strong>
          <br />
          Selected: {JSON.stringify(selected)}
          <br />
          All selected: {allSelected ? 'true' : 'false'}
          <br />
          Some selected: {someSelected ? 'true' : 'false'}
        </div>
      </div>
    );
  },
};
