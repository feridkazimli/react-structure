import { fixupPluginRules } from '@eslint/compat'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginImport from 'eslint-plugin-import'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default tseslint.config(
  { ignores: ['**/dist/*', 'commitlint.config.ts'] },
  {
    extends: [tseslint.configs.recommendedTypeChecked, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
			parser: tseslint.parser,
      ecmaVersion: 6,
      globals: globals.browser,
			sourceType: 'module',
      parserOptions: {
				ecmaFeatures: { jsx: true },
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      }
    },
    plugins: {
			import: fixupPluginRules(pluginImport),
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['./src'],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
			'no-alert': 'error',
      'no-console': 'error',
      eqeqeq: 'error',
      'no-else-return': 'warn',
      'no-unused-vars': 'off',
      'no-extra-boolean-cast': 'off',
      'no-nested-ternary': 'warn',
      'no-unneeded-ternary': 'warn',

      // Plugins
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'unknown', 'sibling', 'parent', 'index'],
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      // https://typescript-eslint.io/rules/no-shadow/
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      // https://typescript-eslint.io/rules/no-unused-expressions/
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowTernary: true,
          allowShortCircuit: true,
          allowTaggedTemplates: true,
        },
      ],
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
	{
		files: ['vite.config.ts'],
    rules: {
      'import/order': 'off',
    },
	},
	pluginQuery.configs['flat/recommended'],
	pluginPrettier
)
