module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    semi: 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        semi: false,
        singleQuote: true,
        jsxSingleQuote: false,
        endOfLine: 'auto',
      },
    ],
  },
};
