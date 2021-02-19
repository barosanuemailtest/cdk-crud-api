import { resolve } from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
    mode: 'none',
    entry: {
        'HelloLambda': './services/lib/hello/HelloLambda.ts',
        'createSpaceItemLambda': './services/lib/spaces/Post.ts',
        'readSpaceItemLambda': './services/lib/spaces/Get.ts',
        'updateSpaceItemLambda': './services/lib/spaces/Put.ts',
        'deleteSpaceItemLambda': './services/lib/spaces/Delete.ts',

        'createReservationLambda': './services/lib/reservations/Post.ts',
        'readReservationLambda': './services/lib/reservations/Get.ts',
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
    externals: {
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