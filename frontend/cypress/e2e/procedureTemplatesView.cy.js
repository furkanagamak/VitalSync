describe("View Procedure Templates Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/ProcedureTemplateManagement");
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

  it("can input and clear search term", () => {
    const searchTerm = "Test Template";
    cy.get('input[type="search"]')
      .type(searchTerm)
      .should("have.value", searchTerm);
    cy.get('input[type="search"]').next("button").click();
    cy.get('input[type="search"]').should("have.value", "");
  });

  it("should navigate to create procedure template form", () => {
    cy.get("button").contains("Create New Template").click({force: true});
    cy.url().should("include", "/CreateProcedureTemplateForm");
    cy.contains("Create New Procedure Template").should("be.visible");
    cy.get("button").contains("Save Template").should("be.visible");
  });

  it("next and prev buttons should be disabled initially", () => {
    cy.get("button").contains("Previous Page").should("be.disabled");
    cy.get("button").contains("Next Page").should("be.disabled");
  });

  it("should allow editing a procedure template", () => {
    cy.get('button[title="Edit"]').first().click();
    cy.url().should("include", "/ModifyProcedureTemplateForm");
  });

  it("should allow deleting a procedure template", () => {
    cy.get('button[title="Delete"]').first().click();
    cy.get("button").contains("Cancel").should("be.visible");
    cy.get("button").contains("Yes").should("be.visible");
    cy.get("button").contains("Cancel").click();
  });
});
