module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
    'react/prop-types': 'warn',
    'react/require-default-props': 'off',
    'react/no-danger': 'off',
    'import/prefer-default-export': 'off',
    'no-console': 'warn',
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: ['state'],
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', jsx: 'never' },
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/**/*.{js,jsx}',
        '**/*.test.{js,jsx}',
        'cypress/**/*.{js,jsx}',
        'src/test/**/*.{js,jsx}',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.stories.{js,jsx}'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
};
