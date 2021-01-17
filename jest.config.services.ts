import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>/services/test'],
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
}

export default config;