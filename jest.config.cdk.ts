import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>/cloud_infrastructure/test'],
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
}

export default config;