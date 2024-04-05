describe("Home Page", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/home");

    cy.contains("My Process Dashboard");
    cy.contains("Next").click();
    cy.contains("Previous").click();

    cy.contains("Pelvic Ultrasound").click();
    cy.url().should("include", "/boardProcess");
  });
});
