module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'jsx-a11y', 'react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/alt-text': 'error',
  },
  overrides: [
    {
      files: ['**/*.stories.tsx', '**/*.stories.ts'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
};
