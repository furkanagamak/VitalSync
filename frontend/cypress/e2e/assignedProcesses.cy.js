describe("Assigned Processes List Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
  });

  it("successfully loads assigned processes List", () => {
    // welcome messag
    cy.contains("Hello, John Doe, you have 1 process assigned").should(
      "be.visible"
    );

    // assigned procedure
    cy.contains("ProcedureName").should("be.visible");

    // room
    cy.contains("TRoom 102").should("be.visible");

    // patient label
    cy.contains("Patient:").should("be.visible");
    cy.contains("Alice Smith").should("be.visible");

    // process label
    cy.contains("Process:").should("be.visible");
    cy.contains("ProcessName").should("be.visible");

    // current procedure
    cy.contains("Current Procedure").should("be.visible");

    // Your turn label
    cy.contains("Your Turn!").should("be.visible");

    // pagination
    cy.contains("Your Turn!").should("be.visible");
    cy.contains("Previous");
    cy.contains("Next");
  });

  it("navigating to board process view", () => {
    cy.contains("ProcedureName").click();
    cy.url().should("include", "/boardProcess/TPID-123");
  });
});
