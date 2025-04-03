/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['**/*.test.ts'],
    transform: {
      '^.+\\.ts
  : ['ts-jest', {
        tsconfig: 'tsconfig.json',
        useESM: false,
      }]
    },
    transformIgnorePatterns: [
      'node_modules/(?!(ts-jest)/)'
    ],
    verbose: true
  }