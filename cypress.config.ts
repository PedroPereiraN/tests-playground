import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: './__tests__/cypress/e2e/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: './__tests__/cypress/fixtures/*', // Your custom fixtures folder
    supportFile: './__tests__/cypress/support/e2e.ts', // Your custom support file
    downloadsFolder: './__tests__/cypress/downloads/*', // Your custom downloads folder
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
