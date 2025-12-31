describe('auth tests', () => {
  it('perform authentication steps', () => {
    cy.visit('/');

    cy.get('[data-id="title"]').should('be.visible');
    cy.get('[data-id="username-label"]').should('be.visible');
    cy.get('[data-id="username-input"]').should('be.visible');
    cy.get('[data-id="username-error"]').should('not.be.exist');
    cy.get('[data-id="password-label"]').should('be.visible');
    cy.get('[data-id="password-input"]').should('be.visible');
    cy.get('[data-id="password-error"]').should('not.be.exist');

    cy.get('[data-id="form-btn"]').click();
    cy.get('[data-id="username-error"]').should('be.visible');
    cy.get('[data-id="password-error"]').should('be.visible');

    cy.get('[data-id="username-input"]').type('WrongUsername');
    cy.get('[data-id="password-input"]').type('password');
    cy.get('[data-id="form-btn"]').click();
    cy.get('.event-content')
      .should('be.visible')
      .find('p')
      .should(
        'contain.text',
        'Password needs to contain uppercase and lowercase letters, numbers and special characters (@$!%*?&#).',
      );

    cy.get('[data-id="username-input"]').clear();
    cy.get('[data-id="password-input"]').clear();

    cy.get('[data-id="username-input"]').type('WrongUsername');
    cy.get('[data-id="password-input"]').type('Password123!');
    cy.get('[data-id="form-btn"]').click();
    cy.get('.event-content')
      .should('be.visible')
      .find('p')
      .should('contain.text', 'User not found with username: "WrongUsername".');

    cy.get('[data-id="username-input"]').clear();
    cy.get('[data-id="password-input"]').clear();

    cy.get('[data-id="username-input"]').type('username');
    cy.get('[data-id="password-input"]').type('Password123!');
    cy.get('[data-id="form-btn"]').click();
    cy.get('.event-content')
      .should('be.visible')
      .find('p')
      .should('contain.text', 'Wrong password.');

    cy.get('[data-id="username-input"]').clear();
    cy.get('[data-id="password-input"]').clear();

    cy.get('[data-id="username-input"]').type('username');
    cy.get('[data-id="password-input"]').type('Password@123');
    cy.get('[data-id="form-btn"]').click();
    cy.get('.event-content')
      .should('be.visible')
      .find('p')
      .should(
        'contain.text',
        'Token successfully generated: "super-secret-token"',
      );
  });
});
