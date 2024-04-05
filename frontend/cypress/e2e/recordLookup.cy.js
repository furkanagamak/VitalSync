describe('Record Lookup Page Tests', () => {
    beforeEach(() => {
        cy.visit('/recordLookup');
    });

    it('successfully loads record lookup page', () => {
        cy.contains('Completed Process Records').should('be.visible');
    });
});

describe('Completed Process Tests', () => {
    beforeEach(() => {
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
  