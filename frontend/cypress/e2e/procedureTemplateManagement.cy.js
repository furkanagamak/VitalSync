describe('Procedure Template Management', () => {
    beforeEach(() => {
      cy.visit('/ProcedureTemplateManagement');
    });
  
    it('successfully loads', () => {
      cy.contains('Procedure Template Management');
    });
  
    it('can navigate to create template form', () => {
      cy.get('button').contains('Create Template').click();
      cy.url().should('include', '/CreateProcedureTemplateForm');
    });
  
    it('can input and clear search term', () => {
      const searchTerm = 'Test Template';
      cy.get('input[type="search"]').type(searchTerm).should('have.value', searchTerm);
      cy.get('input[type="search"]').next('button').click();
      cy.get('input[type="search"]').should('have.value', '');
    });
  
    it('paginates through the procedure templates', () => {
      cy.get('button').contains('Previous Page').should('be.disabled');
      cy.get('button').contains('Next Page').should('not.be.disabled').click();
      cy.get('button').contains('Previous Page').should('not.be.disabled');
    });
  });
  