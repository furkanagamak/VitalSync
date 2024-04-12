describe('Active Processes List Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
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