const path = require('path')
const webpack = require('webpack')

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'scripts/[name]-[hash:5].js',
    chunkFilename: 'scripts/[name]-[hash:5].js',
  },
  module: {
    rules: [{
        test: /\.tsx?/,
        use: [
          'react-hot-loader/webpack',
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.json'),
            },
          },
        ],
        include: /src/,
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[name]-[hash].[ext]',
        },
        include: /src/,
      },
      {
        test: /\.(otf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          mimetype: 'application/font-woff',
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // CITA_SERVER: JSON.stringify('http://47.75.129.215:1337'),
        // CITA_SERVER: JSON.stringify('http://localhost:4000'),
        CITA_SERVER: JSON.stringify('http://47.97.171.140:4000'),
        // CITA_SERVER: JSON.stringify('http://121.196.200.225:1337'),
        APP_NAME: JSON.stringify('Microscope'),
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.svg', '.png', '.jpg'],
  },
}
