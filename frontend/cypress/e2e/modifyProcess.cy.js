describe('Modify Process Landing Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/modifyProcess/activeProcesses');
        cy.get('button').contains('Modify').first().click();
        cy.wait(1000);
    });

    it('successfully modifies a process', () => {
        cy.contains('Process:').should('be.visible');
        cy.contains('Patient:').should('be.visible');

        cy.contains('View Resource Assignments').first().click();
        cy.contains("Back").click();
        cy.contains('View Staff Assignments').first().click();
        cy.contains("Back").click();
        cy.get('#editProcessName').click();
        cy.get('#editProcessNameField').type('New Process Name');
        cy.get('#editProcessNameSave').click();
        cy.wait(300);
        cy.get('button').contains('Save Changes').click();
        cy.contains('Process changes saved!').should('be.visible');
        cy.url().should("include", "/activeProcesses");


    });

   
});





