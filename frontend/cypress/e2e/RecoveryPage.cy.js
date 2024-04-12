describe('Forgot Password Flow', () => {
    before(() => {
      cy.visit('/RecoveryPage'); 
    });
  
    it('Do the whole test', () => {
      cy.get('button').contains('Submit').click();
      cy.contains('Please enter your email address.').should('be.visible');
      cy.get('#emailInput').type('john.doe@example.com');
      cy.get('button').contains('Submit').click();
      cy.contains('A code has been sent to your email.').should('be.visible');
    });

  });
  