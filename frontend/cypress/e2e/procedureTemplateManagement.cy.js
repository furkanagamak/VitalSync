describe('Procedure Template Management', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#emailInput').type('john.doe@example.com');
      cy.get('#passwordInput').type('password123');
      cy.get('button').contains('Sign in').click();
      cy.wait(1000);
      cy.visit('/ProcedureTemplateManagement');
    });
  
    it('successfully loads', () => {
      cy.contains('Procedure Template Management');
    });
  
    it('can input and clear search term', () => {
      const searchTerm = 'Test Template';
      cy.get('input[type="search"]').type(searchTerm).should('have.value', searchTerm);
      cy.get('input[type="search"]').next('button').click();
      cy.get('input[type="search"]').should('have.value', '');
    });
  
    /*it('paginates through the procedure templates', () => {
      cy.get('button').contains('Previous Page').should('be.disabled');
      cy.get('button').contains('Next Page').should('not.be.disabled').click();
      cy.get('button').contains('Previous Page').should('not.be.disabled');
    });*/
  });
  