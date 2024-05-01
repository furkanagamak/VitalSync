describe("Home Page", () => {
  it("loading and navigating", () => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("http://localhost:3000/home");

    /*cy.contains("My Process Dashboard");

    cy.contains("ProcedureName").click();
    cy.url().should("include", "/boardProcess");*/
  });
});
