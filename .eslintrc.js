module.exports = {
  root: true,
  extends: '@react-native-community',
  overrides: [
    {
      files: ['**/*.*'],
      rules: {
        'react-hooks/exhaustive-deps': 'off',
      },
    },
  ],
};
