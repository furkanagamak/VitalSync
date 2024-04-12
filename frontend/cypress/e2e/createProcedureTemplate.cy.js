describe('Create Procedure Template Form Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/CreateProcedureTemplateForm');
    });

    it('successfully loads Create Procedure Template Form', () => {
        cy.contains('Create New Procedure Template').should('be.visible');
        cy.contains('Create Template').should('be.visible');
        cy.contains('Go Back').should('be.visible');
    });

    it('allows navigation back to the procedure template management page ', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/ProcedureTemplateManagement');
      });

    it("goes to the procedure template management page after creating a template", () => {
        cy.get('button').contains('Create Template').click();
        cy.url().should('include', '/ProcedureTemplateManagement');
    });
    it('fills out the form', () => {
        cy.get("#name").type("Test Procedure");
        cy.get("#name").should("have.value", "Test Procedure");

        cy.get("#description").type("Test Description");
        cy.get("#description").should("have.value", "Test Description");

        cy.get("#estimatedTime").type("12");
        cy.get("#estimatedTime").should("have.value", "12");

        cy.get("#specialInstructions").type("Test Instructions");
        cy.get("#specialInstructions").should("have.value", "Test Instructions");
      });
});
