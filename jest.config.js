module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
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
