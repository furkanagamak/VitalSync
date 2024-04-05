describe('Modify Section Form Tests', () => {
    beforeEach(() => {
        cy.visit('/ModifySectionForm');
    });

    it('successfully loads Modify Section Form', () => {
        cy.contains('Modify Section').should('be.visible');
        cy.contains('Go Back').should('be.visible');
    });

    it('allows navigation back to the modify process page ', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/ModifyProcessTemplateForm');
      });

    it("goes to the modify process page after creating a section", () => {
        cy.get('button').contains('Modify Section').click();
        cy.url().should('include', '/ModifyProcessTemplateForm');
    });
    it('fills out the form', () => {
        cy.get('input[name="name"]').clear().type('Test Section');
        cy.get('input[name="name"]').should('have.value', 'Test Section');
    });

    it('should contain the specific section description text within the form', () => {
        cy.visit('/ModifySectionForm');
        cy.contains('Procedures administered during the surgery.').should('exist');
    });

    it('should contain the specific section procedures text within the form', () => {
        cy.visit('/ModifySectionForm');
        cy.contains('General Anesthesia').should('exist');
        cy.contains('Appendix Removal').should('exist');
    });
});
