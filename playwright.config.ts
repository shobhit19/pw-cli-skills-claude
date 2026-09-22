import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests',
      testIgnore: '**/api-tests/**',
      use: {
        baseURL: 'https://www.saucedemo.com',
        testIdAttribute: 'data-test',
      },
    },
    {
      name: 'api',
      testDir: './tests/api-tests',
      // petstore3.swagger.io is a shared public demo, not a dedicated test
      // backend — a full-parallel burst of requests against it produces
      // spurious 500s. Running tests within each file sequentially (paired
      // with --workers=1 in the test:api script) keeps load on it low.
      fullyParallel: false,
      use: {
        // Trailing slash matters: endpoint classes use relative paths with no
        // leading slash (e.g. request.get('pet/1')) so they resolve under
        // /api/v3/... instead of being treated as absolute-from-origin.
        baseURL: 'https://petstore3.swagger.io/api/v3/',
      },
    },
  ],
});
