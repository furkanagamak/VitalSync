describe("Modify Process Template Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/ProcessTemplateManagement");
    cy.get('input[type="search"]')
      .type("ProcessName")
      .should("have.value", "ProcessName");
    cy.get('button[title="Edit"]').first().click();
    cy.wait(500);
    cy.url().should("include", "/ModifyProcessTemplateForm");
  });

  it("successfully loads the form", () => {
    cy.contains("Modify Process Template").should("be.visible");
    cy.contains("Save Template").should("be.visible");
    cy.contains("Go Back").should("be.visible");
  });

  it("allows navigation back to the process template management page ", () => {
    cy.url().should("include", "/ModifyProcessTemplateForm");
    cy.get("button").contains("Go Back").click();
  });

  it("should display error message for process name", () => {
    cy.get("#name").clear();
    cy.get("button").contains("Save Template").click();
    cy.contains("Process name is required.").should("be.visible");
  });

  it("should display error message for description", () => {
    cy.get("#name").clear();
    cy.get("#name").type("Test Process");
    cy.get("#name").should("have.value", "Test Process");
    cy.get("#description").clear();
    cy.get("button").contains("Save Template").click();
    cy.contains("A description is required.").should("be.visible");
  });

  it("should display error message for sections", () => {
    cy.get("#name").clear();
    cy.get("#name").type("Test Process");
    cy.get("#name").should("have.value", "Test Process");
    cy.get("#description").clear();
    cy.get("#description").type("Test Description");
    cy.get("#description").should("have.value", "Test Description");
    cy.get("button").contains("Save Template").click();
    cy.contains("At least one section is required.").should("be.visible");
  });

  it("adding, modifying, and deleting a section should work", () => {
    cy.get("#name").clear().type("Test Process");
    cy.get("#name").should("have.value", "Test Process");
    cy.get("#description").clear().type("Test Description");
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
    cy.url().should("include", "/ModifyProcessTemplateForm");

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
    cy.url().should("include", "/ModifyProcessTemplateForm");

    cy.get('button[title="Delete"]').first().click();
    cy.contains("Save Template").click();
    cy.contains("At least one section is required.").should("be.visible");
  });

  it("should update and modify a procedure template successfully", () => {
    // Mocking server response
    cy.intercept("PUT", "/processTemplates/*", { statusCode: 200 }).as(
      "updateTemplate"
    );

    // Fill out the form
    cy.get("#name").clear().type("Updated Procedure");
    cy.get("#description").clear().type("Updated Description");
    cy.get("button").contains("Add Section").click();
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
    cy.contains("Save Section").click();

    cy.contains("Section Added!").should("be.visible");
    cy.contains("Test Section").should("be.visible");
    cy.contains("Test Section Description").should("be.visible");
    cy.contains("ProcedureName").should("be.visible");
    cy.url().should("include", "/ModifyProcessTemplateForm");

    // Submit the form
    cy.get("button").contains("Save Template").click();

    // Check if navigation occurred and toast message is displayed
    cy.wait("@updateTemplate");
    cy.url().should("include", "/ProcessTemplateManagement");
    cy.contains("Process Template Updated Successfully!").should("be.visible");
  });

  it("should handle server errors during template modification", () => {
    // Mocking a server error
    cy.intercept("PUT", "/processTemplates/*", {
      statusCode: 500,
      body: { error: "Server error" },
    });

    // Fill out the form
    cy.get("#name").clear().type("Updated Procedure");
    cy.get("#description").clear().type("Updated Description");
    cy.get("button").contains("Add Section").click();
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
    cy.contains("Save Section").click();

    cy.contains("Section Added!").should("be.visible");
    cy.contains("Test Section").should("be.visible");
    cy.contains("Test Section Description").should("be.visible");
    cy.contains("ProcedureName").should("be.visible");
    cy.url().should("include", "/ModifyProcessTemplateForm");

    // Submit the form
    cy.get("button").contains("Save Template").click();

    // Check for error handling
    // Check for error handling
    cy.contains("Failed to update process template").should("be.visible");
  });
});
