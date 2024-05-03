describe("Process Details", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("maryjane@gmail.com");
    cy.get("#passwordInput").type("123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("http://localhost:3000/processDetails/TPID-12312312");
  });

  it("loading", () => {
    /* Page Header */
    cy.contains("Process Details");
    cy.contains("PROCESS ID: TPID-12312312");

    // Details headers
    cy.get("#processDetailNameElem").should("have.text", "Routine Checkup");
    cy.get("#processDetailPatientNameElem").should("have.text", "John Smith");
    cy.get("#processDetailCurrProcedElem").should("have.text", "Blood Test");
    cy.get("#processDetailCompProceElem").should("have.text", "0");
    cy.get("#processDetailTotalProceElem").should("have.text", "1");

    /* Chat */
    cy.get("#processChat-TPID-12312312");

    /* Procedures */

    // section
    cy.contains("INCOMPLETE");
    cy.contains("This is the start of the chat");

    // procedure
    cy.contains("Name:");
    cy.contains("Description:");
    cy.contains("Special Instructions:");
    cy.contains("Mark as Completed");
    cy.contains("People Involved:");
    cy.contains("Equipment used:");
    cy.contains("Space used:");
  });

  it("chatting", () => {
    // attempts to chat
    cy.get("#chatInputElem-TPID-12312312").type("Hello World!");
    cy.get("#chatSendElem-TPID-12312312").click();

    cy.get("#chatInputElem-TPID-12312312").should("have.text", "");
    cy.contains("Hello World!");
    cy.contains("Mary Jane");
  });

  it("mark procedure as complete, notification drop down, notification box", () => {
    // mark as completed
    cy.contains("Mark as Completed").click();

    // page state updated correctly
    cy.contains("Mark as Completed").not();
    cy.contains("INCOMPLETE").not();
    cy.get("#processDetailCompProceElem").should("have.text", "1");
    cy.get("#processDetailCurrProcedElem").should(
      "have.text",
      "All procedures are completed."
    );

    // notification drop down should receive notifications
    cy.get("#notificationsBtn").click();
    cy.contains(
      "A procedure Blood Test has been completed for the process Routine Checkup with the process ID TPID-12312312 that you are a part of."
    );

    // clicking notifications in notification drop down should take you to process page
    cy.contains("Procedure Completion").click();
    cy.url().should("include", "/processDetails/TPID-12312312");

    // notification box should have message as well
    cy.visit("http://localhost:3000/notifications");
    cy.contains(
      "A procedure Blood Test has been completed for the process Routine Checkup with the process ID TPID-12312312 that you are a part of. There are no more procedures left in the process. The process is fully complete."
    );
  });
});
