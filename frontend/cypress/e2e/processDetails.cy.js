describe("Process Details", () => {
  it("loading and navigating", () => {
    cy.visit('/');
    cy.get('#emailInput').type('john.doe@example.com');
    cy.get('#passwordInput').type('password123');
    cy.get('button').contains('Sign in').click();
    cy.wait(1000);
    cy.visit("http://localhost:3000/processDetails");

    cy.contains("Process");
    cy.contains("Patient");
    cy.contains("Current Procedure");
    cy.contains("Completed Procedures");
    cy.contains("Total Procedures");
    cy.contains("PROCESS ID");
  });
});
