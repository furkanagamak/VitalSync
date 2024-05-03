describe("Delete Process Template Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/ProcessTemplateManagement");
    cy.intercept("DELETE", "/processTemplates/*", { statusCode: 200 }).as(
      "deleteTemplate"
    );
  });

  it("should load the process template management page", () => {
    cy.url().should("include", "/ProcessTemplateManagement");
    cy.get("h1").contains("Process Template Management").should("be.visible");
    cy.get('input[type="search"]').should("be.visible");
    cy.contains("Name").should("be.visible");
    cy.contains("Description").should("be.visible");
    cy.contains("Sections").should("be.visible");
    cy.contains("Procedures").should("be.visible");
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

  it("should delete a process template and update the table upon confirmation", () => {
    cy.get("tbody tr").first().find('button[title="Delete"]').click();
    cy.contains("Yes").should("be.visible").click();
    cy.wait("@deleteTemplate")
      .its("request.url")
      .should("include", "/processTemplates/");
    cy.contains("Process template deleted successfully").should("be.visible");
    cy.contains("ProcessName").should("not.exist");
  });

  it("should handle server errors during deletion gracefully", () => {
    cy.intercept("DELETE", "/processTemplates/*", {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    }).as("deleteFailure");
    cy.get("tbody tr").first().find('button[title="Delete"]').click();
    cy.contains("Yes").click();
    cy.wait("@deleteFailure");
    cy.contains("Internal Server Error").should("be.visible");
    cy.contains("ProcessName").should("be.visible");
  });
});
