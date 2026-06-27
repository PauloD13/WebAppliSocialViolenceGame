module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react", "@typescript-eslint", "react-refresh"],
  rules: {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-refresh/only-export-components": ["warn", { "allowConstantExport": true }],
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["camelCase"],
        "leadingUnderscore": "allow"
      },
      {
        "selector": ["variable", "function"],
        "format": ["camelCase", "PascalCase"] 
      },
      {
        "selector": ["interface", "typeAlias"],
        "format": ["PascalCase"]
      },
      {
        "selector": "enumMember",
        "format": ["UPPER_CASE"]
      }
    ]
  },
  settings: {
    "react": {
      "version": "detect"
    }
  }
};