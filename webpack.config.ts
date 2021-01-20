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
    externals:{
        'aws-sdk': 'aws-sdk'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        libraryTarget: 'commonjs2',
        path: resolve(__dirname, 'build'),
        filename: '[name]/[name].js'
    }
};

export default config;