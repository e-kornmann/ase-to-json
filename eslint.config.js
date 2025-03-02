import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


/** @type {import('eslint').Linter.Config[]} */

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'arrow-parens': ['error', 'as-needed'],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'object-curly-newline': ['error', { 'ImportDeclaration': 'never' }],
      'no-console': 'off',
      'max-len': ['error', { 'code': 150 }],
      'indent': ['error', 2],
      'quotes': ['error', 'single']
    }
  }
];

