describe('Create Process Template Form Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/CreateProcessTemplateForm');
    });

    it('successfully loads Create Process Template Form', () => {
        cy.contains('Create New Process Template').should('be.visible');
        cy.contains('Save Template').should('be.visible');
        cy.contains('Go Back').should('be.visible');
    });

    it('allows navigation back to the process template management page ', () => {
        cy.get('button').contains('Add Section').click();
        cy.url().should('include', '/AddSectionForm');
      });

      it('allows navigation back to the process template management page ', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/ProcessTemplateManagement');
      });

    /*it("goes to the process template management page after creating a template", () => {
        cy.get('button').contains('Create Template').click();
        cy.url().should('include', '/ProcessTemplateManagement');
    });*/
    it('fills out the form', () => {
        cy.get('input[name="name"]').clear().type('Test Process');
        cy.get('input[name="name"]').should('have.value', 'Test Process');
      });
});
