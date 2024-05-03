describe("Create Process Template Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/CreateProcessTemplateForm");
  });

  it("successfully loads the form", () => {
    cy.contains("Create New Process Template").should("be.visible");
    cy.contains("Save Template").should("be.visible");
    cy.contains("Go Back").should("be.visible");
  });

  it("allows navigation back to the process template management page ", () => {
    cy.url().should("include", "/CreateProcessTemplateForm");
    cy.get("button").contains("Go Back").click();
  });

  it("should display error message for process name", () => {
    cy.get("button").contains("Save Template").click();
    cy.contains("Process name is required.").should("be.visible");
  });

  it("should display error message for description", () => {
    cy.get("#name").type("Test Process");
    cy.get("#name").should("have.value", "Test Process");
    cy.get("button").contains("Save Template").click();
    cy.contains("A description is required.").should("be.visible");
  });

  it("should display error message for sections", () => {
    cy.get("#name").type("Test Process");
    cy.get("#name").should("have.value", "Test Process");
    cy.get("#description").type("Test Description");
    cy.get("#description").should("have.value", "Test Description");
    cy.get("button").contains("Save Template").click();
    cy.contains("At least one section is required.").should("be.visible");
  });

  it("adding, modifying, and deleting a section should work", () => {
    cy.get("#name").type("Test Process");
    cy.get("#name").should("have.value", "Test Process");
    cy.get("#description").type("Test Description");
    cy.get("#description").should("have.value", "Test Description");
    cy.get("button").contains("Add Section").click();
    cy.url().should("include", "/AddSectionForm");

    cy.get("#name").type("Test Section");
    cy.get("#name").should("have.value", "Test Section");
    cy.get("#description").type("Test Section Description");
    cy.get("#description").should("have.value", "Test Section Description");

    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.get('button[title="Move Down"]').first().click();
    cy.get('button[title="Move Up"]').first().click();
    cy.get('button[title="Delete"]').first().click();

    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.contains("Save Section").click();

    cy.contains("Section Added!").should("be.visible");
    cy.contains("Test Section").should("be.visible");
    cy.contains("Test Section Description").should("be.visible");
    cy.contains("ProcedureName").should("be.visible");
    cy.url().should("include", "/CreateProcessTemplateForm");

    cy.get('button[title="Move Down"]').first().click();
    cy.get('button[title="Move Up"]').first().click();
    cy.get('button[title="Edit"]').first().click();

    cy.url().should("include", "/ModifySectionForm");
    cy.get("#name").clear().type("Updated Section");
    cy.get("#description").clear().type("Updated Section Description");
    cy.contains("Add Procedure").click();
    cy.contains("Please select a procedure to add.").should("be.visible");
    cy.get('button[title="Move Down"]').first().click();
    cy.get('button[title="Move Up"]').first().click();
    cy.get('button[title="Delete"]').first().click();
    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.contains("Save Section").click();
    cy.contains("Section Modified!").should("be.visible");

    cy.contains("Updated Section").should("be.visible");
    cy.contains("Updated Section Description").should("be.visible");
    cy.contains("ProcedureName").should("be.visible");
    cy.url().should("include", "/CreateProcessTemplateForm");

    cy.get('button[title="Delete"]').first().click();
    cy.contains("Save Template").click();
    cy.contains("At least one section is required.").should("be.visible");
  });

  it("submits the form successfully", () => {
    cy.get("#name").type("New Process");
    cy.get("#name").should("have.value", "New Process");

    cy.get("#description").type("New Description");
    cy.get("#description").should("have.value", "New Description");

    cy.get("button").contains("Add Section").click();
    cy.url().should("include", "/AddSectionForm");

    cy.get("#name").type("New Section");
    cy.get("#name").should("have.value", "New Section");
    cy.get("#description").type("New Section Description");
    cy.get("#description").should("have.value", "New Section Description");

    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.get('button[title="Move Down"]').first().click();
    cy.get('button[title="Move Up"]').first().click();
    cy.get('button[title="Delete"]').first().click();

    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.contains("Save Section").click();

    cy.contains("Section Added!").should("be.visible");
    cy.contains("New Section").should("be.visible");
    cy.contains("New Section Description").should("be.visible");
    cy.contains("ProcedureName").should("be.visible");
    cy.url().should("include", "/CreateProcessTemplateForm");
    cy.get('button[title="Move Down"]').first().click();
    cy.get('button[title="Move Up"]').first().click();
    cy.contains("Save Template").click();
    cy.contains("Process Template Created Successfully!").should("be.visible");
    cy.url().should("include", "/ProcessTemplateManagement");
  });

  it("should handle server errors during creation gracefully", () => {
    cy.get("#name").type("New Process");
    cy.get("#name").should("have.value", "New Process");

    cy.get("#description").type("New Description");
    cy.get("#description").should("have.value", "New Description");

    cy.get("button").contains("Add Section").click();
    cy.url().should("include", "/AddSectionForm");

    cy.get("#name").type("New Section");
    cy.get("#name").should("have.value", "New Section");
    cy.get("#description").type("New Section Description");
    cy.get("#description").should("have.value", "New Section Description");

    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.get('button[title="Move Down"]').first().click();
    cy.get('button[title="Move Up"]').first().click();
    cy.get('button[title="Delete"]').first().click();

    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.contains("Save Section").click();

    cy.contains("Section Added!").should("be.visible");
    cy.contains("New Section").should("be.visible");
    cy.contains("New Section Description").should("be.visible");
    cy.contains("ProcedureName").should("be.visible");
    cy.url().should("include", "/CreateProcessTemplateForm");
    cy.get('button[title="Move Down"]').first().click();
    cy.get('button[title="Move Up"]').first().click();

    cy.intercept("POST", "/processTemplates", {
      statusCode: 500,
      body: { error: "Internal server error" },
    }).as("createRequest");

    cy.get("button").contains("Save Template").click();
    cy.wait("@createRequest");
    cy.contains("Failed to create process template").should("be.visible");
  });
});
