describe("Active Processes List Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/processManagement/modifyProcess/activeProcesses");
  });

  it("successfully loads Active Processes List", () => {
    cy.contains("Patient:").should("be.visible");
    cy.contains("Process:").should("be.visible");
    cy.contains("Process ID:").should("be.visible");
    cy.contains("Current Procedure:");
    cy.contains("Next Procedure:");
    cy.contains("View").should("be.visible");
    cy.contains("Modify").should("be.visible");

    // loads process TPID-123
    cy.contains("Alice Smith");
    cy.contains("ProcessName");
    cy.contains("TPID-123");
    cy.contains("ProcedureName");
    cy.contains("None");

    // loads process TPID-12312312
    cy.contains("John Smith");
    cy.contains("Routine Checkup");
    cy.contains("TPID-12312312");
    cy.contains("Blood Test");

    // loads process AB12CD34
    cy.contains("Alice Johnson");
    cy.contains("Radical Prostatectomy");
    cy.contains("AB12CD34");
    cy.contains("Anesthesia Shot");
    cy.contains("Prostate Removal");
  });

  it("view and modify navigation", () => {
    // navigate to view
    cy.get("#activeProcessViewBtn-TPID-123").click();
    cy.url().should("include", "/processDetails/TPID-123");

    cy.visit("/processManagement/modifyProcess/activeProcesses");
    cy.get("#activeProcessViewBtn-TPID-12312312").click();
    cy.url().should("include", "/processDetails/TPID-12312312");

    cy.visit("/processManagement/modifyProcess/activeProcesses");
    cy.get("#activeProcessViewBtn-AB12CD34").click();
    cy.url().should("include", "/processDetails/AB12CD34");

    // navigate to modify
    cy.visit("/processManagement/modifyProcess/activeProcesses");
    cy.get("#activeProcessModifyBtn-TPID-123").click();
    cy.url().should(
      "include",
      "/processManagement/modifyProcess/landing/TPID-123"
    );

    cy.visit("/processManagement/modifyProcess/activeProcesses");
    cy.get("#activeProcessModifyBtn-TPID-12312312").click();
    cy.url().should(
      "include",
      "/processManagement/modifyProcess/landing/TPID-12312312"
    );

    cy.visit("/processManagement/modifyProcess/activeProcesses");
    cy.get("#activeProcessModifyBtn-AB12CD34").click();
    cy.url().should(
      "include",
      "/processManagement/modifyProcess/landing/AB12CD34"
    );
  });
});
