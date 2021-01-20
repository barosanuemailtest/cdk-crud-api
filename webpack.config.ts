import { resolve } from 'path';
import { Configuration } from 'webpack';
import * as nodessd from 'webpack-node-externals';

const config: Configuration = {
    mode: 'none',
 //   externals: [nodessd()],
    entry: {
        'HelloLambda': './services/lib/hello/HelloLambda.ts',
        'GetOneLambda': './services/lib/crud/GetOne.ts',
        'CreateOneLambda': './services/lib/crud/CreateOne.ts'
    },
    target: 'node',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.webpack.json"
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    // devtool: "source-map",
    output: {
        libraryTarget: 'commonjs2',
        path: resolve(__dirname, 'build'),
        filename: '[name]/[name].js'
    }
};

export default config;