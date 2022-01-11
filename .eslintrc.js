module.exports = {
  root: true,
  extends: '@react-native-community',
  overrides: [
    {
      files: ['**/*.*'],
      rules: {
        'react-hooks/exhaustive-deps': 'off',
      },
      env: {
        es2020: true,
      },
    },
  ],
};
