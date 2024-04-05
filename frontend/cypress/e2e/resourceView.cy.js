describe("Resource View and Edit", () => {
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
