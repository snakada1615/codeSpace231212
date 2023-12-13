const path = require('path')

module.exports = {
  stories: [
    // Your story paths here
  ],

  addons: [
    // Your addons here
  ],

  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.sass$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../')
    })

    return config
  },

  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },

  docs: {
    autodocs: true
  }
}
