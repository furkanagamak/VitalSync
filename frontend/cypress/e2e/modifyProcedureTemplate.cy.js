describe('Modify Procedure Template Form Tests', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#emailInput').type('john.doe@example.com');
      cy.get('#passwordInput').type('password123');
      cy.get('button').contains('Sign in').click();
      cy.wait(1000);
      cy.visit('/ModifyProcedureTemplateForm');
    });
  
    it('should navigate to the Procedure Template Management page when the Go Back button is clicked', () => {
      cy.get('button').contains('Go Back').click();
      cy.url().should('include', '/ProcedureTemplateManagement');
    });
  
    it('should notify and navigate when Modify Template button is clicked', () => {
      cy.get('button').contains('Modify Template').click();
      cy.url().should('include', '/ProcedureTemplateManagement');
    });

    it('should contain the specific instructions text within the form', () => {
      cy.visit('/ModifyProcedureTemplateForm');
      cy.contains('NPO (nothing by mouth) for 8 hours before the procedure.').should('exist');
    });

    it('should contain the specific description text within the form', () => {
      cy.visit('/ModifyProcedureTemplateForm');
      cy.contains('A state of controlled unconsciousness during which a patient is asleep and unaware of their surroundings.').should('exist');
    });
    
  });
  