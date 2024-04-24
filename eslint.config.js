import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

import importPlugin from 'eslint-plugin-import'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'

import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import jestPlugin from 'eslint-plugin-jest'

const browser = {}
for (const [key, value] of Object.entries(globals.browser)) {
  browser[key.trim()] = value
}

export default tseslint.config(
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      jest: jestPlugin,
    },
  },
  {
    ignores: [
      'lib/**',
      '**/*.json',
      '**/*.yml',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '/types/**',
      '/utils/**',
      '/src/templates/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig.spec.json',
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    rules: {
      'import/extensions': ['error', 'always'],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always', // import groups の間 1行あける
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true }, // 大文字小文字関係なくアルファベット順にしたい
        },
      ],
    },
  },
  {
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  }
)
