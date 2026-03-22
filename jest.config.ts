export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/tests/**/*.test.ts'],  // matches any tests/ folder
  setupFiles: ['<rootDir>/tests/setup.ts'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/tests/**',   // exclude test files from coverage calculation
    '!**/index.ts',
    '!**/*.d.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@database/(.*)$': '<rootDir>/database/$1',
  },
  maxWorkers: 1,
  forceExit: true,
};