Cypress.Commands.add('realizarLogin', (usuario, senha) => {
  cy.get('[data-test="username"]').clear().type(usuario);
  cy.get('[data-test="password"]').clear().type(senha);
  cy.get('[data-test="login-button"]').click();
});