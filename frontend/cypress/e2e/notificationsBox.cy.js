describe("Notification Box", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/notifications");
    cy.contains("My Notifications");
  });
});
