describe("Resource View and Edit", () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#emailInput').type('john.doe@example.com');
    cy.get('#passwordInput').type('password123');
    cy.get('button').contains('Sign in').click();
    cy.wait(1000);
    cy.visit('/resources');
});
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/resources");
    cy.contains("Resources");
  });
  it("navigating to create new resource", () => {
    cy.visit("http://localhost:3000/resources");
    cy.get("#createNewResourceBtn").click();
    cy.url().should("include", "/resources/create");
  });
});
