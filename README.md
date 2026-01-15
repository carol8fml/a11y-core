# Accessible Component Library ♿

This package provides the core component library for a Web Accessibility-focused (WCAG) design system and automated code quality.

[![A11y Tests](https://img.shields.io/badge/A11y_Tests-Passed-brightgreen?style=for-the-badge&logo=accessibility)](https://github.com/carol8fml/a11y-core/actions/workflows/ci.yml)
[![Documentation](https://img.shields.io/badge/Storybook-Live_Demo-FF4785?style=for-the-badge&logo=storybook)](https://carol8fml.github.io/a11y-core)
[![npm version](https://img.shields.io/npm/v/@carol8fml/a11y-core?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@carol8fml/a11y-core)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## ✨ Features

- ✅ **WCAG 2.1 Level AA Compliant** - All components meet accessibility standards
- ✅ **Full Keyboard Navigation** - Complete keyboard support for all interactive elements
- ✅ **Screen Reader Optimized** - Proper ARIA attributes and semantic HTML
- ✅ **Internationalization Ready** - All text strings are configurable via props
- ✅ **TypeScript** - Fully typed with strict type checking
- ✅ **Zero Accessibility Violations** - Tested with `jest-axe` (151 tests passing)

## 📦 Installation

```bash
npm install @carol8fml/a11y-core
```

## 🚀 Quick Start

```tsx
import { Button } from '@carol8fml/a11y-core';
import '@carol8fml/a11y-core/dist/style.css';

function App() {
  return <Button variant="primary">Click me</Button>;
}
```

## 📋 Requirements

**React:** 18.2.0+ (uses `useId` hook)  
**TypeScript:** 5.3+ (recommended)  
**Browsers:** Modern browsers with ES6+ support

**Compatible with:** Next.js, Vite, Create React App, Remix, Gatsby, and any React 18.2.0+ project.

## 🎯 WCAG 2.1 Conformity

This library is **WCAG 2.1 Level AA compliant**. All components meet accessibility standards including:

- ✅ Keyboard navigation (2.1.1, 2.1.2)
- ✅ Focus management (2.4.3, 2.4.7)
- ✅ Semantic HTML and ARIA (1.3.1, 4.1.2)
- ✅ Error identification (3.3.1, 3.3.2)
- ✅ Status messages (4.1.3)

**Verification:** All components tested with `jest-axe` - **0 accessibility violations**.

## 🌍 Internationalization

All text strings are configurable via props for full i18n support:

```tsx
// TextField
<TextField
  showPasswordLabel="Mostrar senha"
  hidePasswordLabel="Ocultar senha"
/>

// Modal
<Modal.Root overlayAriaLabel="Fechar modal">
  <Modal.Content
    closeButtonAriaLabel="Fechar diálogo"
    closeButtonSrText="Fechar"
  >
    <Modal.Footer
      defaultCancelLabel="Cancelar"
      defaultConfirmLabel="Confirmar"
    />
  </Modal.Content>
</Modal.Root>

// Toast
<Toast
  closeButtonAriaLabel="Fechar notificação"
  closeButtonSrText="Fechar"
/>

// Link
<Link externalLinkSrText="(abre em nova aba)">
  External Link
</Link>
```

**Note:** English fallbacks provided for backward compatibility.

## 📚 Components

- **Button** - Accessible button with variants
- **Link** - Accessible link with external link support
- **TextField** - Text input with label, error, and helper text
- **Checkbox** - Checkbox with label, error, and indeterminate state
- **Switch** - Toggle switch with keyboard support
- **Modal** - Accessible modal with focus trap
- **Toast** - Accessible toast notifications

## 📖 Documentation

- **Storybook:** [Live Documentation](https://carol8fml.github.io/a11y-core)
- **Components:** See Storybook for all component APIs and examples

## 🛠️ Usage Examples

### Button

```tsx
<Button variant="primary" size="md">Primary</Button>
<Button variant="outline" size="sm">Outline</Button>
```

### TextField

```tsx
<TextField
  label="Email"
  type="email"
  error="Email is required"
  helperText="Enter your email address"
/>
```

### Modal

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Content titleId="modal-title">
    <Modal.Header>
      <Modal.Title id="modal-title">Modal Title</Modal.Title>
    </Modal.Header>
    <div>Modal content</div>
    <Modal.Footer
      cancelButton={{ label: 'Cancel' }}
      confirmButton={{ label: 'Confirm', onClick: handleConfirm }}
    />
  </Modal.Content>
</Modal.Root>;
```

### Toast

```tsx
import { ToastContainer, useToast } from '@carol8fml/a11y-core';

function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <>
      <button
        onClick={() =>
          addToast({
            type: 'success',
            title: 'Success!',
            description: 'Operation completed',
          })
        }
      >
        Show Toast
      </button>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
```

## 🛠️ Stack and Tools

| Technology                         | Purpose                                           |
| :--------------------------------- | :------------------------------------------------ |
| **React 18**                       | Core framework for building components            |
| **TypeScript**                     | Type safety and developer experience              |
| **CSS Modules**                    | Scoped styles to prevent conflicts                |
| **CVA (Class Variance Authority)** | Type-safe component variants management           |
| **Vitest**                         | Fast unit and integration testing                 |
| **React Testing Library**          | User-centric component testing                    |
| **Jest-Axe**                       | Automated accessibility testing (WCAG compliance) |
| **Storybook**                      | Component documentation and visual testing        |
| **Vite**                           | Fast build tool and development server            |
| **ESLint**                         | Code quality and accessibility linting            |
| **Prettier**                       | Code formatting consistency                       |
| **Husky**                          | Git hooks for pre-commit quality checks           |

## 🏗️ Engineering Highlights

| Concept              | Approach                                                   |
| :------------------- | :--------------------------------------------------------- |
| **Accessibility**    | Jest-Axe in CI/CD - Automated tests ensure WCAG compliance |
| **CSS Architecture** | CSS Modules + CVA - Scoped styles with type-safe variants  |
| **Type Safety**      | TypeScript Strict Mode - Full type coverage                |
| **Testing**          | Vitest + RTL + Jest-Axe - 151 tests, 0 violations          |

## 🧪 Development

```bash
# Clone and install
git clone https://github.com/carol8fml/a11y-core.git
cd a11y-core
npm install

# Run Storybook
npm run storybook

# Run tests
npm test
```

## 📄 License

MIT License

## 👤 Author

Carolina Gonçalves

<a href="https://www.linkedin.com/in/carolina-gon%C3%A7alves-a23689198">![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)</a>
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=contato.devcarolina@gmail.com">![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)</a>
