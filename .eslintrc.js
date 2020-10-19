module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'indent': 'off',
    'no-undef': 'off',
    'no-multi-str': 'off',
    'no-underscore-dangle': 'off',
    'lines-between-class-members': 'off',
    'arrow-parens': [2, 'as-needed'],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/explicit-member-accessibility': [2, {
      'accessibility': 'no-public',
    }],
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.ts']
      }
    },
  },
}
