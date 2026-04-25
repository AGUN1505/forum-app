// Custom Cypress commands
// https://on.cypress.io/custom-commands

// Login command untuk digunakan di test lain
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
