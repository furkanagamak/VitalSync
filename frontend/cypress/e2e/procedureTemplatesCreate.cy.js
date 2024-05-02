describe("Create Procedure Template Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/CreateProcedureTemplateForm");
  });

  it("successfully loads the form", () => {
    cy.contains("Create New Procedure Template").should("be.visible");
    cy.contains("Save Template").should("be.visible");
    cy.contains("Go Back").should("be.visible");
  });

  it("allows navigation back to the procedure template management page ", () => {
    cy.url().should("include", "/CreateProcedureTemplateForm");
    cy.get("button").contains("Go Back").click();
    cy.url().should("include", "/ProcedureTemplateManagement");
  });

  it("should display error message for procedure name", () => {
    cy.get("button").contains("Save Template").click();
    cy.contains("Procedure name is required.").should("be.visible");
  });

  it("should display error message for resource", () => {
    cy.get("#name").type("Test Procedure");
    cy.get("#name").should("have.value", "Test Procedure");
    cy.get("#estimatedTime").type("12");
    cy.get("#estimatedTime").should("have.value", "12");
    cy.get("button").contains("Save Template").click();
    cy.contains("At least one resource is required.").should("be.visible");
  });

  it("should display error message for estimated time", () => {
    cy.get("#name").type("Test Procedure");
    cy.get("#name").should("have.value", "Test Procedure");
    cy.get("button").contains("Save Template").click();
    cy.contains("Estimated time is required.").should("be.visible");
  });

  it("adds a resource and a role", () => {
    cy.get('[id="selectType"]').click();
    cy.get("li").contains("Type").click(); // Select from dropdown
    cy.get('[id="selectName"]').click();
    cy.get("li").contains("Name").click(); // Select from dropdown
    cy.get("button").contains("Add Resource").click();

    // Check if resource is added to the list
    cy.get("ul").first().children().should("have.length", 1);

    cy.get('[id="selectRole"]').click();
    cy.get("li").eq(1).click();
    cy.get('input[name="quantity"]').last().type("1");
    cy.get("button").contains("Add Role").click();

    // Check if role is added to the list
    cy.get("ul").last().children().should("have.length", 1);
  });

  it("fills out the form", () => {
    cy.get("#name").type("Test Procedure");
    cy.get("#name").should("have.value", "Test Procedure");

    cy.get("#description").type("Test Description");
    cy.get("#description").should("have.value", "Test Description");

    cy.get("#estimatedTime").type("12");
    cy.get("#estimatedTime").should("have.value", "12");

    cy.get("#specialInstructions").type("Test Instructions");
    cy.get("#specialInstructions").should("have.value", "Test Instructions");
  });

  it("submits the form successfully", () => {
    cy.get("#name").type("New Procedure");
    cy.get("#name").should("have.value", "New Procedure");

    cy.get("#description").type("New Description");
    cy.get("#description").should("have.value", "New Description");

    cy.get("#estimatedTime").type("12");
    cy.get("#estimatedTime").should("have.value", "12");

    cy.get("#specialInstructions").type("New Instructions");
    cy.get("#specialInstructions").should("have.value", "New Instructions");

    cy.get('[id="selectType"]').click();
    cy.get("li").contains("Type").click(); // Select from dropdown
    cy.get('[id="selectName"]').click();
    cy.get("li").contains("Name").click(); // Select from dropdown
    cy.get("button").contains("Add Resource").click();

    // Check if resource is added to the list
    cy.get("ul").first().children().should("have.length", 1);

    cy.get('[id="selectRole"]').click();
    cy.get("li").eq(1).click();
    cy.get('input[name="quantity"]').last().type("1");
    cy.get("button").contains("Add Role").click();

    // Check if role is added to the list
    cy.get("ul").last().children().should("have.length", 1);

    // Submit form
    cy.get("button").contains("Save Template").click();
    cy.contains("Procedure Template Created Successfully!").should(
      "be.visible"
    );
    cy.url().should("include", "/ProcedureTemplateManagement");
  });

  it("handles server errors on form submission", () => {
    // Prepare form for submission
    cy.get("#name").type("Test Procedure");
    cy.get("#name").should("have.value", "Test Procedure");

    cy.get("#description").type("Test Description");
    cy.get("#description").should("have.value", "Test Description");

    cy.get("#estimatedTime").type("12");
    cy.get("#estimatedTime").should("have.value", "12");

    cy.get("#specialInstructions").type("Test Instructions");
    cy.get("#specialInstructions").should("have.value", "Test Instructions");

    cy.get('[id="selectType"]').click();
    cy.get("li").contains("Type").click(); // Select from dropdown
    cy.get('[id="selectName"]').click();
    cy.get("li").contains("Name").click(); // Select from dropdown
    cy.get("button").contains("Add Resource").click();

    // Check if resource is added to the list
    cy.contains("Name - 1").should("be.visible");

    cy.get('[id="selectRole"]').click();
    cy.get("li").eq(1).click();
    cy.get('input[name="quantity"]').last().type("1");
    cy.get("button").contains("Add Role").click();

    // Check if role is added to the list
    cy.get("ul").last().children().should("have.length", 1);

    cy.intercept("POST", "/procedureTemplates", {
      statusCode: 500,
      body: { error: "Internal server error" },
    }).as("createRequest");

    cy.get("button").contains("Save Template").click();
    cy.wait("@createRequest");
    cy.contains(
      "Failed to create procedure template: Internal server error"
    ).should("be.visible");
  });
});
