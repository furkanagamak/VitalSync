describe("Modify Procedure Template Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/ProcedureTemplateManagement");
    cy.get('input[type="search"]')
      .type("ProcedureName")
      .should("have.value", "ProcedureName");
    cy.get('button[title="Edit"]').first().click();
  });

  it("successfully loads the form", () => {
    cy.contains("Modify Procedure Template").should("be.visible");
    cy.contains("Modify Template").should("be.visible");
    cy.contains("Go Back").should("be.visible");
  });

  it("allows navigation back to the procedure template management page ", () => {
    cy.url().should("include", "/ModifyProcedureTemplateForm");
    cy.get("button").contains("Go Back").click();
    cy.url().should("include", "/ProcedureTemplateManagement");
  });

  it("should display error message for procedure name", () => {
    cy.get("#name").clear();
    cy.get("button").contains("Modify Template").click();
    cy.contains("Procedure name is required.").should("be.visible");
  });

  it("should display error message for resource", () => {
    cy.get("#deleteResource").click();
    cy.get("button").contains("Modify Template").click();
    cy.contains("At least one resource is required.").should("be.visible");
  });

  it("should display error message for estimated time", () => {
    cy.get("#estimatedTime").clear();
    cy.get("button").contains("Modify Template").click();
    cy.contains("Estimated time is required.").should("be.visible");
  });

  it("should update and modify a procedure template successfully", () => {
    // Mocking server response
    cy.intercept("PUT", "/procedureTemplates/*", { statusCode: 200 }).as(
      "updateTemplate"
    );

    // Fill out the form
    cy.get("#name").clear().type("Updated Procedure");
    cy.get("#estimatedTime").clear().type("90");
    cy.get("#description").clear().type("Updated description here");
    cy.get("#specialInstructions").clear().type("Updated special instructions");

    // Submit the form
    cy.get("button").contains("Modify Template").click();

    // Check if navigation occurred and toast message is displayed
    cy.wait("@updateTemplate");
    cy.url().should("include", "/ProcedureTemplateManagement");
    cy.contains("Procedure Template Modified Successfully!").should(
      "be.visible"
    );
  });

  it("should handle server errors during template modification", () => {
    // Mocking a server error
    cy.intercept("PUT", "/procedureTemplates/*", {
      statusCode: 500,
      body: { error: "Server error" },
    });

    // Fill out the form
    cy.get("#name").clear().type("New Procedure");
    cy.get("#estimatedTime").clear().type("45");

    // Attempt to submit the form
    cy.get("button").contains("Modify Template").click();

    // Check for error handling
    cy.contains("Failed to modify procedure template: Server error").should(
      "be.visible"
    );
  });
});
