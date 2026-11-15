/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  displayName: 'clapp-common',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.tests.json',
      },
    ],
  },
  // inversify 8 and @orion76 packages ship ESM only; let ts-jest transpile them
  // and their scoped deps. Under pnpm the packages live in node_modules/.pnpm/...,
  // so the .pnpm node must be transformed too (its first path segment after
  // node_modules/ is `.pnpm`, which previously fell through to the ignore).
  transformIgnorePatterns: ['/node_modules/(?!\\.pnpm|inversify|@inversifyjs|@orion76)'],
  moduleNameMapper: {
    // Tests compile the sources directly: map the workspace packages to `src` so a
    // jest run does not depend on prebuilt `packages/*/dist` bundles, and the
    // linked `@orion76/*` libraries to their `src` because their `exports`
    // `default` points to unbuilt `lib/`/`dist` (node-plugin/logger have no lib/).
    '^@clapp/common$': '<rootDir>/src/index.ts',
    '^@clapp/utils$': '<rootDir>/../utils/src/index.ts',
    '^@orion76/node-plugin$': '<rootDir>/../../libraries/node-plugin/src/public-api.ts',
    '^@orion76/plugin$': '<rootDir>/../../libraries/plugin/src/public-api.ts',
    '^@orion76/logger$': '<rootDir>/../../libraries/logger/src/public-api.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
