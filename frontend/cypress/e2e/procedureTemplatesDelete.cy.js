describe("Delete Procedure Template Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/ProcedureTemplateManagement");
    cy.intercept("DELETE", "/procedureTemplates/*", { statusCode: 200 }).as(
      "deleteTemplate"
    );
  });

  it("should load the procedure template management page", () => {
    cy.url().should("include", "/ProcedureTemplateManagement");
    cy.get("h1").contains("Procedure Template Management").should("be.visible");
    cy.get('input[type="search"]').should("be.visible");
    cy.contains("Name").should("be.visible");
    cy.contains("Description").should("be.visible");
    cy.contains("Resources").should("be.visible");
    cy.contains("Roles").should("be.visible");
    cy.contains("Estimated Time").should("be.visible");
    cy.contains("Special Notes").should("be.visible");
    cy.contains("Actions").should("be.visible");
    cy.contains("Create New Template").should("exist");
  });

  it("should open the delete confirmation modal when delete button is clicked", () => {
    cy.get("tbody tr").first().find('button[title="Delete"]').click();
    cy.contains("Are you sure you want to delete:").should("be.visible");
    cy.contains("Yes").should("be.visible");
    cy.contains("Cancel").should("be.visible");
  });

  it("should close the confirmation modal on cancel", () => {
    cy.get("tbody tr").first().find('button[title="Delete"]').click();
    cy.contains("Are you sure you want to delete:").should("be.visible");
    cy.contains("Yes").should("be.visible");
    cy.contains("Cancel").should("be.visible").click();
  });

  it("should delete a procedure template and update the table upon confirmation", () => {
    cy.get("tbody tr").first().find('button[title="Delete"]').click();
    cy.contains("Yes").should("be.visible").click();
    cy.wait("@deleteTemplate")
      .its("request.url")
      .should("include", "/procedureTemplates/");
    cy.contains("Procedure template deleted successfully").should("be.visible");
    cy.contains("ProcedureName").should("not.exist");
  });

  it("should handle server errors during deletion gracefully", () => {
    cy.intercept("DELETE", "/procedureTemplates/*", {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    }).as("deleteFailure");
    cy.get("tbody tr").first().find('button[title="Delete"]').click();
    cy.contains("Yes").click();
    cy.wait("@deleteFailure");
    cy.contains("Internal Server Error").should("be.visible");
    cy.contains("ProcedureName").should("be.visible");
  });
});
