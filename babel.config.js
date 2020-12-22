module.exports = {
  presets: [
    '@babel/preset-typescript',
    'jest',
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
};
