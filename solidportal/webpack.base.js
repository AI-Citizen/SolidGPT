const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './src/view/index.tsx'), // 入口文件
  output: {
    filename: 'static/js/[name].js',
    path: path.join(__dirname, './dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.svg$/,
        use: ['svg-url-loader'],
      },

    ]
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/view/index.html'),
      inject: true, // 自动注入静态资源
    }),
  ],
};
