/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

const API_URL =
  Cypress.env('API_URL') || 'https://staging-api.ezzycare.com/api';

Cypress.Commands.add('login', () => {
  const email = Cypress.env('CYPRESS_EMAIL');
  const password = Cypress.env('CYPRESS_PASSWORD');

  cy.request({
    method: 'POST',
    url: `${API_URL}/auth/login`,
    body: { email, password },
  }).then((response) => {
    expect(response.body).to.have.property('success', true);
    const data = response.body.data;
    const cookieValue = JSON.stringify({
      access_token: data.access_token,
      email_verified: data.email_verified ?? true,
      is_account_type_selected: data.is_account_type_selected ?? true,
      user: data.user,
      expires: new Date(Date.now() + 600000).toISOString(),
    });
    cy.setCookie('ezzy-auth-user', cookieValue, { path: '/' });
  });
});
