describe('Forgot Password Flow', () => {
    before(() => {
      cy.visit('/RecoveryPage'); 
    });
  
    it('Do the whole test', () => {
      cy.get('button').contains('Submit').click();
      cy.contains('Please enter your email address.').should('be.visible');
      cy.get('#emailInput').type('user@example.com');
      cy.get('button').contains('Submit').click();
      cy.contains('A code has been sent to your email.').should('be.visible');
      cy.contains('Time left:').should('be.visible');
      cy.get('#codeInput').type('123456');
      cy.get('button').contains('Submit').click();
      cy.contains('New Password:').should('be.visible');
      cy.get('#changePassword').type('newSecurePassword');
      cy.get('#confirmPassword').type('newSecurePassword');
      cy.get('button').contains('Submit').click();
      cy.contains('Password has been successfully changed').should('be.visible');
      cy.url().should('include', '/'); 
    });

  });
  