module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['vite.config.js', 'postcss.config.js', 'tailwind.config.js', 'scripts/**/*.mjs', '*.config.js'],
      env: { node: true },
    },
    {
      files: ['**/*.test.js', '**/*.test.jsx'],
      env: { node: true },
      globals: { describe: 'readonly', it: 'readonly', expect: 'readonly', vi: 'readonly', beforeEach: 'readonly' },
    },
  ],
};
