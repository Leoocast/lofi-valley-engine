import path from "node:path"

import { includeIgnoreFile } from "@eslint/compat"
import js from "@eslint/js"
import { configs, plugins, rules } from "eslint-config-airbnb-extended"
import { rules as prettierConfigRules } from "eslint-config-prettier"
import prettierPlugin from "eslint-plugin-prettier"

const gitignorePath = path.resolve(".", ".gitignore")

const jsConfig = [
  // ESLint Recommended Rules
  {
    name: "js/config",
    ...js.configs.recommended,
  },
  // Stylistic Plugin
  plugins.stylistic,
  // Import X Plugin
  plugins.importX,
  // Airbnb Base Recommended Config
  ...configs.base.recommended,
  // Strict Import Config
  rules.base.importsStrict,
]

const reactConfig = [
  // React Plugin
  plugins.react,
  // React Hooks Plugin
  plugins.reactHooks,
  // React JSX A11y Plugin
  plugins.reactA11y,
  // Airbnb React Recommended Config
  ...configs.react.recommended,
  // Strict React Config
  rules.react.strict,
]

const typescriptConfig = [
  // TypeScript ESLint Plugin
  plugins.typescriptEslint,
  // Airbnb Base TypeScript Config
  ...configs.base.typescript,
  // Strict TypeScript Config
  rules.typescript.typescriptEslintStrict,
  // Airbnb React TypeScript Config
  ...configs.react.typescript,
]

const prettierConfig = [
  // Prettier Plugin
  {
    name: "prettier/plugin/config",
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // Prettier Config
  {
    name: "prettier/config",
    rules: {
      ...prettierConfigRules,
      "prettier/prettier": "error",
    },
  },
]

const configLeo = [
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "import-x/prefer-default-export": ["off"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-nested-ternary": ["off"],
      "no-plusplus": ["off"],
      "no-continue": ["off"],
      "no-restricted-syntax": ["off"],
      "jsx-a11y/click-events-have-key-events": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "import-x/order": [
        "warn",
        {
          groups: [
            "external",
            "builtin",
            "type",
            "internal",
            ["parent", "sibling", "index"],
            "unknown",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          // Will now classify 'import type' by path ('external' in this case)
          warnOnUnassignedImports: true,
          distinctGroup: true,
        },
      ],
    },
  },
]

export default [
  // Ignore .gitignore files/folder in eslint
  includeIgnoreFile(gitignorePath),
  // Javascript Config
  ...jsConfig,
  // React Config
  ...reactConfig,
  // TypeScript Config
  ...typescriptConfig,
  // Prettier Config
  ...prettierConfig,
  // Leo config
  ...configLeo,
]
