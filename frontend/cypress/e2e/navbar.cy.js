describe("Navbar", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
  });
  it("roster navigate", () => {
    cy.visit("http://localhost:3000/home");

    cy.contains("Roster").click();
    cy.url().should("include", "/Roster");
  });

  it("admin action navigate", () => {
    cy.visit("http://localhost:3000/home");

    cy.contains("Admin Actions").click();
    cy.url().should("include", "/adminActions");
  });

  it("profile navigate", () => {
    cy.visit("http://localhost:3000/home");

    cy.get("#userNav").click();
    cy.url().should("include", "/Profile");
  });

  it("home navigate", () => {
    cy.visit("http://localhost:3000/home");

    cy.get("#userNav").click();
    cy.get("#navHeader").click();
    cy.url().should("include", "/home");
  });

  it("notification box navigate", () => {
    cy.visit("http://localhost:3000/home");

    cy.get("#notificationsBtn").click();
    cy.contains("No new notifications.");
    cy.get("#notificationsBoxBtn").click();
    cy.url().should("include", "/notifications");
  });

  it("notification drop down open", () => {
    cy.visit("http://localhost:3000/home");

    cy.get("#notificationsBtn").click();
    cy.contains("No new notifications.");
  });

  it("log out test", () => {
    cy.visit("http://localhost:3000/home");
    cy.get("#logoutbtn").click();
    cy.contains("E-mail:");
    cy.contains("Password:");
  });
});
