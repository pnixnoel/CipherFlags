// eslint.config.cjs
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');
const globals = require('globals');


const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  // 1) Core JS + TS + React rules
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:react/recommended',
    // 'plugin:react-hooks/recommended'
  ),

  // 2) Parser + shared settings
  {
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.node, // <--- Add Node.js globals
        // If you ALSO need browser globals for React components etc. in the same block:
        // ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-trailing-spaces': 'error',       // replaces trailing-whitespace hook
      'eol-last': ['error', 'always'],     // replaces end-of-file-fixer hook
      // …your other TS/React overrides…
    },
  },
];
