describe('MyComponent Tests', () => {
    beforeEach(() => {
      cy.visit('/Roster');
    });
  
    it('loads table data on initial render', () => {
      cy.get('table tbody tr').should('have.length.at.least', 1); 
    });
  
    it('filters rows based on search term', () => {
      const searchTerm = 'johnson';
      cy.get('input[placeholder="Search..."]').type(searchTerm);
      cy.get('table tbody tr').each(row => {
        cy.wrap(row).contains(searchTerm, { matchCase: false });
      });
    });
  
    it('filters rows based on selected category', () => {
      cy.get('select').select('Neurology');
      cy.get('table tbody tr').each(row => {
        cy.wrap(row).contains('Neurology');
      });
    });
  
    it('navigates through pages', () => {
      cy.get('button').contains('2').click(); 
      cy.get('table tbody tr').should('have.length.at.least', 1); 
    });
  
    it('navigates to profile on row click', () => {
      cy.get('table tbody tr').contains('John Smith').parent('tr').click();
    });
  });
  