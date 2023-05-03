const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  entry: {
    routine: './public/javascripts/routine.js',
    calendar: './public/javascripts/calendar.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/javascripts/dist'),
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: "all",
  //   },
  // },
  plugins: [
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      }
    ]
  }
};