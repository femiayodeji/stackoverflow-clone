export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/tests/**/*.test.ts'],  // matches any tests/ folder
  coverageDirectory: '../coverage',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/tests/**',   // exclude test files from coverage calculation
    '!**/index.ts',
    '!**/*.d.ts',
  ],
};