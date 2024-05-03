describe("Board Process", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
  });

  it("loading page correctly", () => {
    cy.visit("http://localhost:3000/boardProcess/TPID-123");

    // back to home
    cy.contains("Back to Dashboard");
    cy.get("#homeBtn");

    // process name
    cy.contains("Process:");
    cy.contains("ProcessName");

    // patient name
    cy.contains("Patient:");
    cy.contains("Alice Smith");

    // process id
    cy.contains("PROCESS ID: TPID-123");

    // buttons
    cy.get("#proceduresBtn");
    cy.get("#chatBtn");
    cy.get("#processDetailsBtn");

    // procedures left
    cy.contains("Procedures to complete:");
    cy.get("#proceduresLeftText").should("have.text", "1");

    // procedure
    cy.contains("TRoom 102");
    cy.contains("Special Instructions");
    cy.contains("Description");
    cy.contains("People Assigned");
    cy.contains("People Completed");
    cy.contains("Mark as completed");
  });

  it("page navigations", () => {
    cy.visit("http://localhost:3000/boardProcess/TPID-123");
    // nav to chat
    cy.get("#chatBtn").click();
    cy.get("#processChat-TPID-123");

    // nav back to procedures
    cy.get("#proceduresBtn").click();
    cy.contains("Mark as completed");

    // nav back to home page
    cy.get("#homeBtn").click();
    cy.url().should("include", "/home");

    // nav to process details
    cy.visit("http://localhost:3000/boardProcess/TPID-123");
    cy.get("#processDetailsBtn").click();
    cy.url().should("include", "/processDetails/TPID-123");
  });
});
