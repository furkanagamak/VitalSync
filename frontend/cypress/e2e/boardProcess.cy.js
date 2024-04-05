describe("Board Process", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/boardProcess");

    cy.contains("Process");
    cy.contains("Patient");

    cy.get("#boardProcessProcedures");

    // page switching
    cy.get("#chatBtn").click();
    cy.get("#boardProcessChat");

    cy.get("#proceduresBtn").click();
    cy.get("#boardProcessProcedures");

    cy.get("#processDetailsBtn").click();
    cy.url().should("include", "/processDetails");
  });
});