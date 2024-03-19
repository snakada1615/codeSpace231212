/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:storybook/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    // Specify you want to use the es2020 parser which implies that module is used
    sourceType: 'module',
    // Add TypeScript parser options here:
    parser: '@typescript-eslint/parser'
  },
  // Define overrides if needed for specific file types
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      parserOptions: {
        project: [
          './tsconfig.node.json',
          './tsconfig.app.json',
          './tsconfig.json',
          './tsconfig.vitest.json'
        ]
      }
    }
  ],
  rules: {
    // Add your custom rules
  }
}
