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
      use: {
        baseURL: 'https://petstore3.swagger.io/api/v3',
      },
    },
  ],
});
