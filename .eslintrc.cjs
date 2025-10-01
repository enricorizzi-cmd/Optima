module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    {
      files: ['app/**/*.{ts,tsx}'],
      env: {
        browser: true,
        es2021: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './app/tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'tailwindcss'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:tailwindcss/recommended',
        'prettier',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['backend/**/*.ts'],
      env: {
        node: true,
        es2021: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './backend/tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
      },
    },
  ],
};
