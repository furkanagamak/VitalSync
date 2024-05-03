describe("Board Process", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("maryjane@gmail.com");
    cy.get("#passwordInput").type("123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("http://localhost:3000/boardProcess/AB12CD34");
  });

  it("loading page correctly", () => {
    // back to home
    cy.contains("Back to Dashboard");
    cy.get("#homeBtn");

    // process name
    cy.contains("Process:");
    cy.contains("Radical Prostatectomy");

    // patient name
    cy.contains("Patient:");
    cy.contains("Alice Johnson");

    // process id
    cy.contains("PROCESS ID: AB12CD34");

    // buttons
    cy.get("#proceduresBtn");
    cy.get("#chatBtn");
    cy.get("#processDetailsBtn");

    // procedures left
    cy.contains("Procedures to complete:");

    // procedure
    cy.contains("Special Instructions");
    cy.contains("Description");
    cy.contains("People Assigned");
    cy.contains("People Completed");
    cy.contains("Mark as completed");
  });

  it("page navigations", () => {
    // nav to chat
    cy.get("#chatBtn").click();
    cy.get("#processChat-AB12CD34");

    // nav back to procedures
    cy.get("#proceduresBtn").click();
    cy.contains("Mark as completed");

    // nav back to home page
    cy.get("#homeBtn").click();
    cy.url().should("include", "/home");

    // nav to process details
    cy.visit("http://localhost:3000/boardProcess/AB12CD34");
    cy.get("#processDetailsBtn").click();
    cy.url().should("include", "/processDetails/AB12CD34");
  });

  it("mark procedure as complete, notification drop down, and notification box", () => {
    // mark as completed
    cy.contains("Mark as completed").click();

    // previous completed procedure should be removed
    cy.contains("Anesthesia Shot").not();

    // notification should appear in notification box
    cy.get("#notificationsBtn").click();
    cy.contains(
      "Your assigned procedure Prostate Removal for the process Radical Prostatectomy with the process ID AB12CD34 is the current procedure to be completed."
    );
    cy.contains(
      "A procedure Anesthesia Shot has been completed for the process Radical Prostatectomy with the process ID AB12CD34 that you are a part of."
    );

    // clicking notifications in notification drop down should take you to process page
    cy.contains("Your Turn").click();
    cy.url().should("include", "/processDetails/AB12CD34");

    // notification box should have expected contents
    cy.visit("http://localhost:3000/notifications");
    cy.contains(
      "Your assigned procedure Prostate Removal for the process Radical Prostatectomy with the process ID AB12CD34 is the current procedure to be completed."
    );
    cy.contains(
      "A procedure Anesthesia Shot has been completed for the process Radical Prostatectomy with the process ID AB12CD34 that you are a part of. The next procedure is Prostate Removal. There are 2 procedures left until the process is fully complete."
    );

    // clicking notifications in notifcation box should take you to associating process page
    cy.contains("Your Turn").click();
    cy.url().should("include", "/processDetails/AB12CD34");
  });
});
