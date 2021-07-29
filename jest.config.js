module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**/*.ts',
    '!<rootDir>/src/**/index.ts',
  ],
  coverageDirectory: "coverage",
  moduleNameMapper: {
    '@/tests/(.+)$': '<rootDir>/tests/$1',
    '@/(.+)$': '<rootDir>/src/$1',
  },
  roots: [
    "<rootDir>/src",
    "<rootDir>/tests"
  ],
  transform: {
    '\\.ts$': 'ts-jest'
  },
};
