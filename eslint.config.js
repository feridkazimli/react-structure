import { fixupPluginRules } from '@eslint/compat'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import boundaries from "eslint-plugin-boundaries";
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
			boundaries,
		},
		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true
				},
				node: {
					"extensions": [".js", ".jsx", ".ts", ".tsx"]
				}
			},
			"boundaries/include": ["./src/**/*"],
			"boundaries/elements": [
				{
					"type": "app",
					"pattern": "app"
				},
				{
					"type": "pages",
					"pattern": "src/pages/*",
					"capture": ["page"]
				},
				{
					"type": "widgets",
					"pattern": "widgets/*",
					"capture": ["widget"]
				},
				{
					"type": "features",
					"pattern": "features/*",
					"capture": ["feature"]
				},
				{
					"type": "entities",
					"pattern": "entities/*",
					"capture": ["entity"]
				},
				{
					"type": "shared",
					"pattern": "shared/*",
					"capture": ["segment"]
				}
			]
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
			"boundaries/entry-point": [
				2,
				{
					"default": "disallow",
					"rules": [
						{
							"target": [
								[
									"shared",
									{
										"segment": "lib"
									}
								]
							],
							"allow": "*/index.ts"
						},
						{
							"target": [
								[
									"shared",
									{
										"segment": "lib"
									}
								]
							],
							"allow": "*.(ts|tsx)"
						},
						{
							"target": [
								[
									"shared",
									{
										"segment": "constants"
									}
								]
							],
							"allow": "index.ts"
						},
						{
							"target": [
								[
									"shared",
									{
										"segment": "ui" // ("ui"|"constants")
									}
								]
							],
							"allow": "**"
						},
						{
							"target": ["app", "pages", "widgets", "features", "entities"],
							"allow": "index.(ts|tsx)"
						}
					]
				}
			],
			"boundaries/element-types": [
				2,
				{
					"default": "allow",
					"message": "${file.type} is not allowed to import (${dependency.type})",
					"rules": [
						{
							"from": ["shared"],
							"disallow": ["app", "pages", "widgets", "features", "entities"],
							"message": "Shared module must not import upper layers (${dependency.type})"
						},
						{
							"from": ["entities"],
							"message": "Entity must not import upper layers (${dependency.type})",
							"disallow": ["app", "pages", "widgets", "features"]
						},
						{
							"from": ["entities"],
							"message": "Entity must not import other entity",
							"disallow": [
								[
									"entities",
									{
										"entity": "!${entity}"
									}
								]
							]
						},
						{
							"from": ["features"],
							"message": "Feature must not import upper layers (${dependency.type})",
							"disallow": ["app", "pages", "widgets"]
						},
						{
							"from": ["features"],
							"message": "Feature must not import other feature",
							"disallow": [
								[
									"features",
									{
										"feature": "!${feature}"
									}
								]
							]
						},
						{
							"from": ["widgets"],
							"message": "Feature must not import upper layers (${dependency.type})",
							"disallow": ["app", "pages"]
						},
						{
							"from": ["widgets"],
							"message": "Widget must not import other widget",
							"disallow": [
								[
									"widgets",
									{
										"widget": "!${widget}"
									}
								]
							]
						},
						{
							"from": ["pages"],
							"message": "Page must not import upper layers (${dependency.type})",
							"disallow": ["app"]
						},
						{
							"from": ["pages"],
							"message": "Page must not import other page",
							"disallow": [
								[
									"pages",
									{
										"page": "!${page}"
									}
								]
							]
						}
					]
				}
			]
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
