module.exports = {
  root: true,
  extends: ['expo'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
  ignorePatterns: ['node_modules/', 'coverage/', 'dist/', '.expo/'],
};
