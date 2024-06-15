import type { Config } from 'jest'

const esModules = ['my-gadgetry'].join('|')

const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  silent: false,
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.spec.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  globals: {
    config: './tsconfig.spec.json',
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // transform: {
  //   '^.+\\.(js|jsx)$': 'ts-jest',
  // },
}

export default config
