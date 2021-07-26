module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './src/components',
          '@constants': './src/constants',
          '@services': './src/services',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@utils': './src/utils',
          '@assets': './assets',
        },
      },
    ],
  ],
}
