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
      cy.get('select').as('selectFilter').select('Doctor');
  
      // table contains "Doctor" as position
      cy.get('table').find('tbody tr').each(($el) => {
        cy.wrap($el).find('td').eq(2).should('have.text', 'Doctor');
      });

      cy.get('input[placeholder="Search..."]').type('James Test');

      //Table contains James test as name
      cy.get('table').find('tbody tr').each(($el) => {
        cy.wrap($el).find('td').eq(0).should('have.text', 'James test');
      });


    });
  });

  describe('Profile Editing and Verification', () => {
    it('should correctly update and verify profile information', () => {

      cy.get('input[placeholder="Search..."]').type('James Test');

      cy.get('table tbody tr').first().click();
    
      cy.contains('Edit Profile').click();
  
      // Enter information
      cy.get('#name').clear().type('James Doe');
      cy.get('#designation').clear().type('TS');
      cy.get('#specialty').clear().type('Test');
      cy.get('#department').clear().type('Testing');
  
      // Submit the changes
      cy.contains('Save Changes').click();
  
      // Verify that information is on the screen
      cy.contains('James Doe').should('exist');
      cy.contains('TS').should('exist');
      cy.contains('Test').should('exist');
      cy.contains('Testing').should('exist');
  
      // Edit the profile again 
      cy.contains('Edit Profile').click();
  
      // Change the information to before
      cy.get('#name').clear().type('James test');
      cy.get('#designation').clear().type('MD');
      cy.get('#specialty').clear().type('Doctor');
      cy.get('#department').clear().type('Cardiology');
  
      // Save the changes, no need to verify
      cy.contains('Save Changes').click();
    });
  });

  describe('Edit Eligible Roles interaction', () => {
    it('checks all roles, saves changes, and verifies all remain checked', () => {
      cy.get('input[placeholder="Search..."]').type('James Test');

      cy.get('table tbody tr').first().click();
      // Click the "Edit Eligible Roles" button
      cy.contains('Edit Eligible Roles').click();
  
      //  all checkboxes
      cy.get('input[type="checkbox"]').should('be.visible').each(($el) => {
        cy.wrap($el).check(); 
      });
  
      // Click "Save Changes" button
      cy.contains('Save Changes').click(); 
  
      cy.contains('Roles successfully updated.').should('be.visible');
  
      // Re-open the Edit roles modal to verify
      cy.contains('Edit Eligible Roles').click();
  
      // Verify that all checkboxes remain checked
      cy.get('input[type="checkbox"]').should('be.checked');
    });
  });
  
  describe('Edit Schedule functionality', () => {
  
    it('edits the schedule and verifies the changes', () => {
      cy.get('input[placeholder="Search..."]').type('James Test');

      cy.get('table tbody tr').first().click();
      //Click "Edit Schedule"
      cy.contains('Edit Schedule').click();
      cy.contains('p', 'Sunday')
      .closest('div.grid').closest('div.grid').within(() => {
    cy.get('input[type="time"]').first().then(input => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input[0], '08:00');
      input[0].dispatchEvent(new Event('input', { bubbles: true }));
      input[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
  
  
    
    cy.get('input[type="time"]').last().then(input => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input[0], '16:00');
      input[0].dispatchEvent(new Event('input', { bubbles: true }));
      input[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  
  cy.contains('Update Schedule').click();
  cy.contains('Edit Schedule').click();
  
  cy.contains('p', 'Sunday').closest('div.grid').closest('div.grid').within(() => {
    cy.get('input[type="time"]').first().should('have.value', '08:00');
    cy.get('input[type="time"]').last().should('have.value', '16:00');
  });
  
      //Check "Day Off" for Sunday
      cy.contains('p', 'Sunday') 
        .closest('div.grid')
        .closest('div.grid')
        .within(() => {
          cy.get('input[type="checkbox"]').click();
        });
      
      cy.contains('Update Schedule').click();
      cy.contains('Edit Schedule').click();
  
      cy.contains('p', 'Sunday') 
      .closest('div.grid')
      .closest('div.grid')
      .within(() => {
        cy.get('input[type="checkbox"]').should('be.checked');
      });
    });
  });

  // describe('Termination test', () => {
  //   it('Try wrong email when termiation', () => {

  //     cy.get('input[placeholder="Search..."]').type('James Test');

  //     cy.get('table tbody tr').first().click();

  //     cy.contains('Terminate Account').click();
  //     //Enter the wrong email
  //     cy.get('#terminateConfirm').type('wrongemail@gmail.com')
  //     cy.contains('Submit').click();
  //     //Check for error message
  //     cy.contains('email does not match.').should('be.visible')
  //   });

  //   it('Terminate Account', () => {

  //     cy.get('input[placeholder="Search..."]').type('James Test');

  //     cy.get('table tbody tr').first().click();

  //     cy.contains('Terminate Account').click();
  //     cy.get('#terminateConfirm').type('dummy@example.com')
  //     cy.contains('Submit').click();
  //     cy.contains('Return to Roster Page').click();

  //     cy.get('input[placeholder="Search..."]').type('James Test');
  //     cy.contains('No results found').should('be.visible');

  //   });
  // });
  });
  