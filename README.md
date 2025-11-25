# Accessible Component Library ♿

This package provides the core component library for a Web Accessibility-focused (WCAG) design system and automated code quality.

## Documentation and Project Status

The project's complete visual documentation is available on Storybook, hosted via GitHub Pages.

[![A11y Tests](https://img.shields.io/badge/A11y_Tests-Passed-brightgreen?style=for-the-badge&logo=accessibility)](https://github.com/carol8fml/a11y-core/actions/workflows/ci.yml)
[![Documentation](https://img.shields.io/badge/Storybook-Live_Demo-FF4785?style=for-the-badge&logo=storybook)](https://carol8fml.github.io/a11y-core)

## Engineering Highlights

This project showcases a scalable architecture, designed with a focus on code governance:

| Concept | Approach | Technical Value |
| :--- | :--- | :--- |
| Accessibility (A11y) | Jest-Axe in CI/CD | Automated accessibility tests are mandatory in Pull Requests, ensuring WCAG compliance before merging. |
| CSS Architecture | CSS Modules + CVA | Uses CSS Modules for scope isolation and CVA (Class Variance Authority) for type-safe, performant variant management. |
| Governance | Branch Protection | A Quality Gate requires the CI/CD Jobs (Tests/Lint) to be approved before merging into the stable branches (`main`/`dev`). |

## Installation and Usage

### 1\. Package Installation

```bash
npm install @carol8fml/a11y-core
````

### 2\. Basic Usage

```tsx
import { Button } from '@carol8fml/a11y-core';
import '@carol8fml/a11y-core/dist/style.css'; 

const Component = () => {
  return <Button variant="primary">Accessible</Button>;
};
```

### 3\. Local Development

```bash
# To contribute or view the Storybook
git clone [https://github.com/carol8fml/a11y-core.git](https://github.com/carol8fml/a11y-core.git)
cd a11y-core

# Install and Run Storybook
npm install
npm run storybook
```

## Stack and Tools

| Category | Technology | Rationale |
| :--- | :--- | :--- |
| Language | TypeScript | Guarantees strict typing and predictability for library consumers. |
| Framework | React 18 | Core component library base. |
| Documentation | Storybook | Provides a dedicated, isolated environment for testing and documenting component variations. |
| Testing | Vitest / RTL / Jest-Axe| Full coverage of functionality, user behavior, and WCAG compliance. |

## Author

Carolina Gonçalves

<a href="https://www.linkedin.com/in/carolina-gon%C3%A7alves-a23689198">![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)</a>
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=contato.devcarolina@gmail.com">![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)</a>

## License

This project is licensed under the MIT License.

