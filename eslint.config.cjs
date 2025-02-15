const js = require('@eslint/js');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const importPlugin = require('eslint-plugin-import');
const unusedImports = require('eslint-plugin-unused-imports');
const jest = require('eslint-plugin-jest');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            sourceType: 'module',
            globals: {
                process: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                jest: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': ts,
            'prettier': prettier,
            'import': importPlugin,
            'unused-imports': unusedImports,
            'jest': jest
        },
        rules: {
            ...ts.configs.recommended.rules,
            ...prettier.configs.recommended.rules,
            ...jest.configs.recommended.rules,
            'prettier/prettier': ['error', { 'tabWidth': 4, 'useTabs': false }],
            'unused-imports/no-unused-imports': 'error',
            'indent': ['error', 4, { 'SwitchCase': 1, 'ignoredNodes': ['PropertyDefinition'] }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'argsIgnorePattern': '^_',
                    'varsIgnorePattern': '^_',
                    'caughtErrors': 'all',
                    'ignoreRestSiblings': true,
                    'destructuredArrayIgnorePattern': '^_'
                }
            ],
            'import/order': [
                'error',
                {
                    'groups': [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                    'alphabetize': { order: 'asc', caseInsensitive: true },
                    'warnOnUnassignedImports': false
                }
            ],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: 'import', next: ['const', 'let', 'var', 'expression'] },
                { blankLine: 'always', prev: ['const', 'let', 'var', 'expression'], next: '*' },
                { blankLine: 'always', prev: 'block-like', next: '*' },
                { blankLine: 'always', prev: 'if', next: '*' },
                { blankLine: 'always', prev: 'return', next: '*' },
                { blankLine: 'always', prev: 'function', next: '*' }
            ],
            '@typescript-eslint/no-floating-promises': 'off',
            'jest/expect-expect': 'off'
        },
        settings: {
            'import/resolver': {
                'node': {
                    'extensions': ['.js', '.jsx', '.ts', '.tsx', '.spec.ts', '.e2e-spec.ts']
                },
                'typescript': {
                    'alwaysTryTypes': true,
                    'project': ['./tsconfig.eslint.json']
                }
            }
        }
    },
    {
        files: ['test/**/*.ts'],
        rules: {
            'import/no-extraneous-dependencies': 'off',
            'import/order': 'off'
        }
    }
];
