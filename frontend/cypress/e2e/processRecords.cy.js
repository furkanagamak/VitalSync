describe("Process Records Lookup Page Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/recordLookup");
    cy.intercept("GET", "/processInstances", {
      fixture: "completedProcesses.json",
    }).as("getProcesses");
  });

  it("loads the page and displays initial UI elements", () => {
    cy.wait("@getProcesses");
    cy.get("h1").contains("Completed Process Records").should("be.visible");
    cy.get('input[type="search"]').should("have.value", "");
    cy.get("table").should("be.visible");
    cy.contains("Patient Name").should("be.visible");
    cy.contains("Process ID").should("be.visible");
    cy.contains("Process Name").should("be.visible");
    cy.contains("Description").should("be.visible");
    cy.contains("Procedures").should("be.visible");
    cy.contains("Actions").should("be.visible");
    cy.get("button").contains("Previous Page").should("be.disabled");
    cy.get("button").contains("Next Page").should("not.be.disabled");
    cy.url().should("include", "/recordLookup");
  });

  it("can input and clear search term", () => {
    cy.wait("@getProcesses");
    const searchTerm = "Test Process";
    cy.get('input[type="search"]')
      .type(searchTerm)
      .should("have.value", searchTerm);
    cy.get('input[type="search"]').next("button").click();
    cy.get('input[type="search"]').should("have.value", "");
  });

  it("sorts process records by patient name", () => {
    cy.wait("@getProcesses");
    cy.get("th").contains("Patient Name").click();
    cy.get("tbody tr:first").contains("Alice Johnson").should("be.visible");
  });

  it("sorts process records by process name", () => {
    cy.wait("@getProcesses");
    cy.get("th").contains("Process Name").click();
    cy.get("tbody tr:first").contains("Annual Physical Exam").should("be.visible");
  });

  it("sorts process records by process ID", () => {
    cy.wait("@getProcesses");
    cy.get("th").contains("Process ID").click();
    cy.get("tbody tr:first").contains("001").should("be.visible");
  });

  it("sorts process records by description", () => {
    cy.wait("@getProcesses");
    cy.get("th").contains("Description").click();
    cy.get("tbody tr:first").contains("Consultation for symptoms of flu").should("be.visible");
  });

  it("sorts process records by procedures", () => {
    cy.get("th").contains("Procedures").click();
    cy.get("tbody tr:first").contains("Blood Test, X-ray").should("be.visible");
  });

  it("navigates to the next page and back to the previous page", () => {
    cy.wait("@getProcesses");
    cy.get("button").contains("Next Page").click();
    cy.get("button").contains("Previous Page").should("not.be.disabled");
    cy.get("button").contains("Previous Page").click();
    cy.get("button").contains("Previous Page").should("be.disabled");
  });

  it("navigates to process details on eye button click", () => {
    cy.wait("@getProcesses");
    cy.get("tbody tr:first").find("button").click();
    cy.url().should("include", "/processDetails/");
  });
});
