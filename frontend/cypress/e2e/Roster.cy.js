describe('MyComponent Tests', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#emailInput').type('joshuacjlee@gmail.com');
      cy.get('#passwordInput').type('979501e2eceba10d');
      cy.get('button').contains('Sign in').click();
      cy.wait(1000);
      cy.visit('/Roster');
    });
  
    it('Run test', () => {
      cy.get('table tbody tr').should('have.length.at.least', 1); 

      cy.wait(1000); 
  
      cy.get('select').select('Pediatrics');
  
      cy.get('select').select('Select Category');
      
      cy.get('input[placeholder="Search..."]').type('Jane');
  
      cy.get('tbody tr').first().click();
  
      cy.url().should('include', '/Profile/');
    });
  
  

  });