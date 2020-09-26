module.exports = {
  env: {
    browser: true,
  },
  extends: ['prettier/@typescript-eslint', 'airbnb-typescript/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['/*.*', 'deprecated/', 'dist/'],
  plugins: ['@typescript-eslint'],
  rules: {
    'max-len': [
      'error',
      150,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never',
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi', // 'none' or 'semi' or 'comma'
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi', // 'semi' or 'comma'
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^Interface[A-Z]',
          match: true,
        },
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};
