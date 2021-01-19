import { resolve } from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
    mode: 'none',
    entry: {
        'HelloLambda': './services/lib/hello/HelloLambda.ts',
        'GetOneLambda': './services/lib/crud/GetOne.ts',
        'CreateOneLambda': './services/lib/crud/CreateOne.ts'
    },
    target: 'node',
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
        libraryTarget: 'commonjs2',
        path: resolve(__dirname, 'build'),
        filename: '[name]/[name].js'
    }
};

export default config;