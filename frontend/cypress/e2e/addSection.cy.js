describe('Add Section Form Tests', () => {
    beforeEach(() => {
        cy.visit('/AddSectionForm');
    });

    it('successfully loads Add Section Form', () => {
        cy.contains('Add New Section').should('be.visible');
        cy.contains('Add Section').should('be.visible');
        cy.contains('Go Back').should('be.visible');
    });

    it('allows navigation back to the create process page ', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/CreateProcessTemplateForm');
      });

    it("goes to the create process page after creating a section", () => {
        cy.get('button').contains('Add Section').click();
        cy.url().should('include', '/CreateProcessTemplateForm');
    });
    it('fills out the form', () => {
        cy.get('input[name="name"]').clear().type('Test Section');
        cy.get('input[name="name"]').should('have.value', 'Test Section');
    });
});