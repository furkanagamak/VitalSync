describe("Board Process", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
  });
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/boardProcess/TPID-123");
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
