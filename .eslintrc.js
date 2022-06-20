module.exports = {
  root: true,
  globals: {
    jest: true,
  },
  env: {
    node: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  plugins: [],
  rules: {
    'require-await': 'off',
    'import/named': 'warn',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
  },
}
