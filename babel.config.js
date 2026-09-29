module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    // DİKKAT: Reanimated 4 plugin'i her zaman en altta kalmalıdır!
    'react-native-worklets/plugin',
  ],
};
