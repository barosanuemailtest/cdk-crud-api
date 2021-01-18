import { resolve } from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
    mode: 'none',
    entry: {
        'HelloHandler': './services/lib/hello/HelloHandler.ts',
        'zzHandler': './services/lib/zzhandler/zz.ts'
    },
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
        path: resolve(__dirname, 'build'),
        filename: '[name].js'
    }
};

export default config;