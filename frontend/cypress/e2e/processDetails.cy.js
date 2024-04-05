describe("Process Details", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/processDetails");

    cy.contains("Process");
    cy.contains("Patient");
    cy.contains("Current Procedure");
    cy.contains("Completed Procedures");
    cy.contains("Total Procedures");
    cy.contains("PROCESS ID");
  });
});
