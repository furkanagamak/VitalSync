describe('MyComponent Button Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#emailInput').type('john.doe@example.com');
    cy.get('#passwordInput').type('password123');
    cy.get('button').contains('Sign in').click();
    cy.wait(1000);
    cy.get('.rosterNav').should('be.visible').click();
  });

  describe('Roster Page Tests', () => {

  
    it('filters by position and checks for Filter and name in the table', () => {
      // Click the dropdown to open the selection menu
      cy.get('select').as('selectFilter').select('Doctor');
  
      // Assert that the table contains at least one row with "Doctor" as position
      cy.get('table').find('tbody tr').each(($el) => {
        cy.wrap($el).find('td').eq(2).should('have.text', 'Doctor');
      });

      cy.get('input[placeholder="Search..."]').type('James Test');

      // Optional: If your application filters on form submission, you might need to submit the form
      // cy.get('form').submit();
  
      // Check if the table contains a row with "James Test"


      cy.get('table').find('tbody tr').each(($el) => {
        cy.wrap($el).find('td').eq(0).should('have.text', 'James test');
      });


    });
  });

  describe('Termination test', () => {
    it('Try wrong email when termiation', () => {

      cy.get('input[placeholder="Search..."]').type('James Test');

      cy.get('table tbody tr').first().click();

      cy.contains('Terminate Account').click();
      cy.get('#terminateConfirm').type('wrongemail@gmail.com')
      cy.contains('Submit').click();
      cy.contains('email does not match.').should('be.visible')
    });

    it('Terminate Account', () => {

      cy.get('input[placeholder="Search..."]').type('James Test');

      cy.get('table tbody tr').first().click();

      cy.contains('Terminate Account').click();
      cy.get('#terminateConfirm').type('dummy@example.com')
      cy.contains('Submit').click();
      cy.contains('Return to Roster Page').click();

      cy.get('input[placeholder="Search..."]').type('James Test');
      cy.contains('No results found').should('be.visible');

    });
  });
  });
  