describe('Record Lookup Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/recordLookup');
    });

    it('successfully loads record lookup page', () => {
        cy.contains('Completed Process Records').should('be.visible');
    });
});

describe('Completed Process Tests', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#emailInput').type('john.doe@example.com');
      cy.get('#passwordInput').type('password123');
      cy.get('button').contains('Sign in').click();
      cy.wait(1000);
      cy.visit('/recordProcess');
    });
  
    it('navigates back to the record lookup page on "Go Back"', () => {
      cy.contains('button', 'Go Back').click();
      cy.url().should('include', '/recordLookup');
    });
  
    it('displays process details', () => {
      cy.contains('Process Details').should('be.visible');
      cy.contains('Process:').should('be.visible');
      cy.contains('Patient:').should('be.visible');
      cy.contains('Current Procedure:').should('be.visible');
      cy.contains('Completed Procedures:').should('be.visible');
      cy.contains('Total Procedures:').should('be.visible');
    });
  });
  