// webpack.config.js
module.exports = {
  resolve: {
    fallback: { "path": false, "os": false, "stream": false, "util": false, "assert": false }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-import',
                  'tailwindcss',
                  'autoprefixer',
                ]
              }
            }
          }
        ],
      }
    ]
  }
};
