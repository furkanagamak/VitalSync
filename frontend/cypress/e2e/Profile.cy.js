describe('MyComponent Button Functionality', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#emailInput').type('john.doe@example.com');
      cy.get('#passwordInput').type('password123');
      cy.get('button').contains('Sign in').click();
      cy.wait(1000);
      cy.visit('/Profile/:id'); 
    });
  

    it('changes view to ChangeAvailability on clicking Change Schedule', () => {
      cy.contains('Change Schedule').click();
      cy.contains('Change Availability').should('be.visible');
    });
  
    it('returns to profile view from ChangeAvailability', () => {
      cy.contains('Change Schedule').click();
      cy.contains('Change Availability').should('be.visible');
  
      cy.contains('Submit').click();
      cy.contains('Change Availability').should('not.exist');
    });

    it('profile information changes', () => {
        cy.contains('Edit Profile').click();
        cy.contains('Save Changes').click();
      });

      /* it(' submitting contact changes', () => {
        cy.contains('Change Contact Info').click();
        cy.contains('Save Changes').click();
      }); */
  
      it('successfully completes the reset password flow', () => {
        cy.contains('Reset Password').click();
        cy.contains('Yes').click();
        cy.contains('Close').click();
      });

      it('opens the image uploader and clicks upload', () => {
        cy.contains('Change Profile Image').click();
        cy.contains('Upload').click();
      });

    it('opens termination modal on clicking Terminate Account button', () => {
        cy.contains('Terminate Account').click();
        cy.contains('Are you sure you want to terminate this account?').should('be.visible');
      });
    
      it('closes termination modal on submitting termination', () => {
        cy.contains('Terminate Account').click();
        cy.get('input[type="text"]').type('john smith');
        cy.contains('Submit').click();
        cy.contains('Account has been Terminated').should('exist');
      });
    
  });
  