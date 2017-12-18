module.exports = {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-es2016',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'raw-loader',
        }
      }
    ]
  }
};
