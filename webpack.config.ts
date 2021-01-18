import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
    mode: 'none',
    entry: './services/lib/hello/HelloHandler.ts',
    module: {
        rules: [
            {
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.webpack.json"
                    }
                },
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    // devtool: "source-map",
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'foo.bundle.js'
    }
};

export default config;