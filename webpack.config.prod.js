const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  output: {
    libraryTarget: "commonjs2",
  },
  externals: [{
    react: 'react',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux',
    'react-router': 'react-router',
    'react-router-dom': 'react-router-dom',
    'styled-components': 'styled-components',
    '@material-ui/styles': '@material-ui/styles',
    //'@material-ui/core': '@material-ui/core',
    formik: 'formik',
    'react-number-format': 'react-number-format'
  },
    /^@material-ui\/(core|icons)[\/a-zA-Z]*/
  ],
  resolve: {
    alias: {
      react: path.resolve('node_modules/react'),
      'react-router': path.resolve('node_modules/react-router'),
      '@material-ui/core': path.resolve('node_modules/@material-ui/core'),
      '@material-ui/core/colors': path.resolve('node_modules/@material-ui/core/colors'),
      '@material-ui/styles': path.resolve('node_modules/@material-ui/styles'),
      formik: path.resolve('node_modules/formik')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
  plugins: [
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  }
};