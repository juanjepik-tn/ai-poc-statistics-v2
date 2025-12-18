/* eslint-env node */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    Promise: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/typescript',
  ],
  plugins: ['import'],
  rules: {
    // dont require that interface names be prefixed with I
    '@typescript-eslint/interface-name-prefix': 'off',
    // allow explicit any type
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    // disallow unused vars (typescript)
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_.*', varsIgnorePattern: '^_.*' },
    ],
    // enforce no braces around arrow function bodies where they can be omitted
    'arrow-body-style': ['error', 'as-needed'],
    // require the use of === and !==
    eqeqeq: ['error', 'always'],
    // enforce having one empty lines after the last top-level import statement
    'import/newline-after-import': 'error',
    // allow only log, warn, error, info and trace console methods
    'no-console': [
      'error',
      {
        allow: ['log', 'warn', 'error', 'info', 'trace'],
      },
    ],
    // disallow duplicate module imports. Enforces using a single import statement per module
    'no-duplicate-imports': 'error',
    // disallow multiple empty lines. max number of consecutive empty lines & at the end of files = 1.
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
  },
  ignorePatterns: ['node_modules', '**/*.js'],
};
