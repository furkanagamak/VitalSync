describe("View Process Templates Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/ProcessTemplateManagement");
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

  it("can input and clear search term", () => {
    const searchTerm = "Test Template";
    cy.get('input[type="search"]')
      .type(searchTerm)
      .should("have.value", searchTerm);
    cy.get('input[type="search"]').next("button").click();
    cy.get('input[type="search"]').should("have.value", "");
  });

  it("should navigate to create process template form", () => {
    cy.get("button").contains("Create New Template").click({ force: true });
    cy.url().should("include", "/CreateProcessTemplateForm");
    cy.contains("Create New Process Template").should("be.visible");
    cy.get("button").contains("Save Template").should("be.visible");
  });

  it("next and prev buttons should be disabled initially", () => {
    cy.get("button").contains("Previous Page").should("be.disabled");
    cy.get("button").contains("Next Page").should("be.disabled");
  });

  it("should allow editing a process template", () => {
    cy.get('button[title="Edit"]').first().click();
    cy.url().should("include", "/ModifyProcessTemplateForm");
  });

  it("should allow deleting a process template", () => {
    cy.get('button[title="Delete"]').first().click();
    cy.get("button").contains("Cancel").should("be.visible");
    cy.get("button").contains("Yes").should("be.visible");
    cy.get("button").contains("Cancel").click();
  });
});
