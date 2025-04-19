import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import nodePlugin from 'eslint-plugin-node';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      node: nodePlugin,
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
  },
  prettier,
];
