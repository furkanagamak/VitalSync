describe('Active Processes List Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/modifyProcess/activeProcesses');
    });

    it('successfully loads Active Processes List', () => {
        cy.contains('Patient:').should('be.visible');
        cy.contains('Process:').should('be.visible');
        cy.contains('Process ID:').should('be.visible');
        cy.contains('View').should('be.visible');
        cy.contains('Modify').should('be.visible');
    });

    it('goes to view process details page after clicking View ', () => {
        cy.get('button').contains('View').click();
        cy.url().should('include', '/processDetails');
      });

    it("goes to modify process landing page after clicking modify", () => {
        cy.get('button').contains('Modify').click();
        cy.url().should('include', '/landing');
    });
});