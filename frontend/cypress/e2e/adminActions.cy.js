describe("Admin Actions", () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#emailInput').type('john.doe@example.com');
    cy.get('#passwordInput').type('password123');
    cy.get('button').contains('Sign in').click();
    cy.wait(1000);
});
  it("Process Template Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processTemplates").click();
    cy.url().should("include", "/ProcessTemplateManagement");
  });
  it("Procedure Template Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#procedureTemplates").click();
    cy.url().should("include", "/ProcedureTemplateManagement");
  });
  it("Process Records", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processRecords").click();
    cy.url().should("include", "/recordLookup");
  });
  it("Process Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processManagement").click();
    cy.url().should("include", "/modifyProcess/activeProcesses");
  });
  it("Resource Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processTemplates").click();
    cy.url().should("include", "/ProcessTemplateManagement");
  });
  it("Process Template Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processTemplates").click();
    cy.url().should("include", "/ProcessTemplateManagement");
  });
  it("Create Account", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#createAccount").click();
    cy.url().should("include", "/createAccount");
  });
});
