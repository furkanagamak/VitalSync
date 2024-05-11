describe("Create Account Page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("http://localhost:3000/createAccount");
  });

  it("loading", () => {
    cy.contains("Staff");
    cy.contains("Admin");
  });

  it("select staff", () => {
    cy.get("#selectStaffBtn").click();
    cy.contains("Staff");
  });

  it("select admin", () => {
    cy.get("#selectAdminBtn").click();
    cy.contains("Admin");
  });

  it("Form insertion flow", () => {
    cy.get("#selectAdminBtn").click();
    cy.get("#form1BackBtn").click();
    cy.get("#selectStaffBtn").click();

    cy.get("#firstNameInp").type("John");
    cy.get("#firstNameInp").should("have.value", "John");

    cy.get("#lastNameInp").type("Smith");
    cy.get("#lastNameInp").should("have.value", "Smith");

    cy.get("#degreeInp").click();
    cy.get("li").contains("Bachelors").click();
    cy.get("#degreeInp").invoke("text").should("eq", "Bachelors");

    cy.get("#departmentInp").type("Neuro");
    cy.get("#departmentInp").should("have.value", "Neuro");

    cy.get("#positionInp").type("Head of Department");
    cy.get("#positionInp").should("have.value", "Head of Department");

    cy.get("#eligibleRolesInp").click();
    cy.get("li").contains("surgeon").click();
    cy.get("#eligibleRolesInp").invoke("text").should("eq", "surgeon");

    // next page
    cy.get("#nextBtn").click();

    cy.get("#phoneNumberInp").type("1234567890");
    cy.get("#phoneNumberInp").should("have.value", "123-456-7890");

    cy.get("#emailInp").type("johnsmith123@gmail.com");
    cy.get("#emailInp").should("have.value", "johnsmith123@gmail.com");

    cy.get("#officePhoneNumberInp").type("1234567890");
    cy.get("#officePhoneNumberInp").should("have.value", "123-456-7890");

    cy.get("#officeLocationInp").type("123 drive NY");
    cy.get("#officeLocationInp").should("have.value", "123 drive NY");

    // go back to form1 to check if previous fields are preserved
    cy.get("#form2BackBtn").click();

    cy.get("#firstNameInp").should("have.value", "John");
    cy.get("#lastNameInp").should("have.value", "Smith");
    cy.get("#degreeInp").invoke("text").should("eq", "Bachelors");
    cy.get("#departmentInp").should("have.value", "Neuro");
    cy.get("#positionInp").should("have.value", "Head of Department");
    cy.get("#eligibleRolesInp").invoke("text").should("eq", "surgeon");

    // go back to form2 to check if previous fields are preserved
    cy.get("#nextBtn").click();

    cy.get("#phoneNumberInp").should("have.value", "123-456-7890");
    cy.get("#emailInp").should("have.value", "johnsmith123@gmail.com");
    cy.get("#officePhoneNumberInp").should("have.value", "123-456-7890");
    cy.get("#officeLocationInp").should("have.value", "123 drive NY");

    cy.get("#submitBtn").click();

    cy.contains("Account created successfully");
  });
});
