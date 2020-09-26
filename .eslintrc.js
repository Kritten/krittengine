module.exports = {
  env: {
    browser: true,
  },
  extends: ['airbnb-typescript/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [
    "/*.*",
    'deprecated/',
    'dist/'
  ],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never',
      },
    ],
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: {
        delimiter: 'semi',    // 'none' or 'semi' or 'comma'
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',    // 'semi' or 'comma'
        requireLast: false,
      },
    }]
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};
