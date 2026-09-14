module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-console': 'off',
    'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: false }],
  },
  overrides: [
    {
      files: ['*.config.js', '.eslintrc.cjs'],
      env: {
        node: true,
      },
      rules: {
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
      },
    },
  ],
};
