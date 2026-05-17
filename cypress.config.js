const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com', // URL Global configurada
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});