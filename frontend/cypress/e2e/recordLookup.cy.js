describe('Record Lookup Page Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/recordLookup');
    });

    it('successfully loads record lookup page', () => {
        cy.contains('Completed Process Records').should('be.visible');
        cy.contains('Search for process records').should('be.visible');
    });

    it('edits a process record when open icon is clicked', () => {  //note that the edit will need to be changed to view eventually
        cy.get('[data-testid="edit-icon"]').first().click();
        cy.url().should('include', '/recordProcess');
    });
});

describe('Completed Process Tests', () => {
    beforeEach(() => {
      cy.visit('/completedProcess');
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
  