describe("Login Page Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.wait(1000);
  });

  it("should display all necessary elements", () => {
    cy.get("#emailInput").should("be.visible");
    cy.get("#passwordInput").should("be.visible");
    cy.get("button").contains("Sign in").should("be.visible");
    cy.get("a").contains("Forgot Password").should("be.visible");
  });

  it("should display error message for incorrect credentials", () => {
    cy.get("#emailInput").type("wrongemail@sbu.com");
    cy.get("#passwordInput").type("wrongpassword");
    cy.get("button").contains("Sign in").click();
    cy.contains("Incorrect email or password.").should("be.visible");
  });

  it("should navigate to /home on successful login", () => {
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.url().should("include", "/home");
  });

  it("should disable sign in button if email is empty", () => {
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").should("be.disabled");
  });

  it("should disable sign in button if email is not a valid email", () => {
    cy.get("#emailInput").type("testemail");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").should("be.disabled");
  });

  it("should disable sign in button if password is empty", () => {
    cy.get("#emailInput").type("test@gmail.com");
    cy.get("button").contains("Sign in").should("be.disabled");
  });

  it("should navigate to recovery page on clicking forgot password", () => {
    cy.get("a").contains("Forgot Password").click();
    cy.url().should("include", "/recoveryPage");
  });
});
