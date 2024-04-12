describe('Modify Process Template Form Tests', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('#emailInput').type('john.doe@example.com');
      cy.get('#passwordInput').type('password123');
      cy.get('button').contains('Sign in').click();
      cy.wait(1000);
      cy.visit('/ModifyProcessTemplateForm');
    });
  
    it('should navigate to the Process Template Management page when the Go Back button is clicked', () => {
      cy.get('button').contains('Go Back').click();
      cy.url().should('include', '/ProcessTemplateManagement');
    });
  
    it('should notify and navigate when Modify Template button is clicked', () => {
      cy.get('button').contains('Modify Template').click();
      cy.url().should('include', '/ProcessTemplateManagement');
    });

    it('should contain the specific process description text within the form', () => {
      cy.visit('/ModifyProcessTemplateForm');
      cy.contains('The standard process for performing an appendectomy, which is the surgical removal of the appendix.').should('exist');
    });

    it('should contain the specific section description text within the form', () => {
        cy.visit('/ModifyProcessTemplateForm');
        cy.contains('Procedures administered before the patient leaves the hospital.').should('exist');
    });

    it('should contain the specific section procedures text within the form', () => {
        cy.visit('/ModifyProcessTemplateForm');
        cy.contains('General Anesthesia, Appendix Removal').should('exist');
    });
    
  });
  