describe('MyComponent Tests', () => {
    beforeEach(() => {
      cy.visit('/'); 
    });
  
    it('should display all necessary elements', () => {
      cy.get('#emailInput').should('be.visible');
      cy.get('#passwordInput').should('be.visible');
      cy.get('button').contains('Sign in').should('be.visible');
      cy.get('a').contains('Forgot Password').should('be.visible');
    });
  
    it('should display error message for incorrect credentials', () => {
      cy.get('#emailInput').type('wrongemail@sbu.com');
      cy.get('#passwordInput').type('wrongpassword');
      cy.get('button').contains('Sign in').click();
      cy.contains('Incorrect email or password.').should('be.visible');
    });
  
    it('should navigate to /home on successful login', () => {
      cy.get('#emailInput').type('john.doe@example.com');
      cy.get('#passwordInput').type('password123');
      cy.get('button').contains('Sign in').click();
      cy.url().should('include', '/home'); 
    });
  });
  