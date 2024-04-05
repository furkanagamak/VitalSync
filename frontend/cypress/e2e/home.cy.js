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

describe("Navbar", () => {
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
    cy.get("#notificationsBoxBtn").click();
    cy.url().should("include", "/notifications");
  });

  it("notification drop down open", () => {
    cy.visit("http://localhost:3000/home");

    cy.get("#notificationsBtn").click();
    cy.contains("Your turn");
  });

  it("notification drop down open", () => {
    cy.visit("http://localhost:3000/home");

    cy.get("#notificationsBtn").click();
    cy.contains("Your turn");
  });
});

describe("Admin Actions", () => {
  it("Process Template Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processTemplates").click();
    cy.url().should("include", "/ProcessTemplateManagement");
  });
  it("Procedure Template Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#procedureTemplates").click();
    cy.url().should("include", "/ProcedureTemplateManagement");
  });
  it("Process Records", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processRecords").click();
    cy.url().should("include", "/recordLookup");
  });
  it("Process Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processManagement").click();
    cy.url().should("include", "/modifyProcess/activeProcesses");
  });
  it("Resource Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processTemplates").click();
    cy.url().should("include", "/ProcessTemplateManagement");
  });
  it("Process Template Management", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#processTemplates").click();
    cy.url().should("include", "/ProcessTemplateManagement");
  });
  it("Create Account", () => {
    cy.visit("http://localhost:3000/adminActions");

    cy.get("#createAccount").click();
    cy.url().should("include", "/createAccount");
  });
});

describe("Create Account Page", () => {
  it("loading", () => {
    cy.visit("http://localhost:3000/createAccount");

    cy.contains("Staff");
    cy.contains("Admin");
  });

  it("back to admin actions", () => {
    cy.visit("http://localhost:3000/createAccount");

    cy.get("#selectAccTypeBackBtn").click();
    cy.url().should("include", "/adminActions");
  });

  it("select staff", () => {
    cy.visit("http://localhost:3000/createAccount");

    cy.get("#selectStaffBtn").click();
    cy.contains("Staff");
  });

  it("select admin", () => {
    cy.visit("http://localhost:3000/createAccount");

    cy.get("#selectAdminBtn").click();
    cy.contains("Admin");
  });

  it("Form insertion flow", () => {
    cy.visit("http://localhost:3000/createAccount");

    cy.get("#selectAdminBtn").click();
    cy.get("#form1BackBtn").click();
    cy.get("#selectStaffBtn").click();

    cy.get("#firstNameInp").type("John");
    cy.get("#firstNameInp").should("have.value", "John");

    cy.get("#lastNameInp").type("Smith");
    cy.get("#lastNameInp").should("have.value", "Smith");

    cy.get("#degreeInp").select("Bachelors");
    cy.get("#degreeInp").should("have.value", "bachelors");

    cy.get("#departmentInp").type("Neuro");
    cy.get("#departmentInp").should("have.value", "Neuro");

    cy.get("#positionInp").type("Head of Department");
    cy.get("#positionInp").should("have.value", "Head of Department");

    cy.get("#eligibleRolesInp").select("Surgeon");
    cy.get("#eligibleRolesInp").should("have.value", "surgeon");

    // next page
    cy.get("#nextBtn").click();

    cy.get("#phoneNumberInp").type("1234567890");
    cy.get("#phoneNumberInp").should("have.value", "1234567890");

    cy.get("#emailInp").type("johnsmith123@gmail.com");
    cy.get("#emailInp").should("have.value", "johnsmith123@gmail.com");

    cy.get("#officePhoneNumberInp").type("1234567890");
    cy.get("#officePhoneNumberInp").should("have.value", "1234567890");

    cy.get("#officeLocationInp").type("123 drive NY");
    cy.get("#officeLocationInp").should("have.value", "123 drive NY");

    // go back to form1 to check if previous fields are preserved
    cy.get("#form2BackBtn").click();
    cy.get("#firstNameInp").should("have.value", "John");
    cy.get("#lastNameInp").should("have.value", "Smith");
    cy.get("#degreeInp").should("have.value", "bachelors");
    cy.get("#departmentInp").should("have.value", "Neuro");
    cy.get("#positionInp").should("have.value", "Head of Department");
    cy.get("#eligibleRolesInp").should("have.value", "surgeon");

    // go back to form2 to check if previous fields are preserved
    cy.get("#nextBtn").click();
    cy.get("#phoneNumberInp").should("have.value", "1234567890");
    cy.get("#emailInp").should("have.value", "johnsmith123@gmail.com");
    cy.get("#officePhoneNumberInp").should("have.value", "1234567890");
    cy.get("#officeLocationInp").should("have.value", "123 drive NY");

    cy.get("#submitBtn").click();
  });
});

describe("Resource View and Edit", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/resources");
    cy.contains("Resources");
  });
  it("navigating to create new resource", () => {
    cy.visit("http://localhost:3000/resources");
    cy.get("#createNewResourceBtn").click();
    cy.url().should("include", "/resources/create");
  });
});

describe("Resource Create", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/resources/create");
    cy.contains("Equipments");
    cy.contains("Personnel");
    cy.contains("Spaces");
  });
  it("form flow", () => {
    cy.visit("http://localhost:3000/resources/create");

    // select tests
    cy.get("#selectEquipmentsBtn").click();
    cy.contains("Equipments");
    cy.get("#backToSeleResTypeBtn").click();

    cy.get("#selectPersonnelBtn").click();
    cy.contains("Personnel");
    cy.get("#backToSeleResTypeBtn").click();

    cy.get("#selectSpacesBtn").click();
    cy.contains("Spaces");

    // form insertions
    cy.get("#nameInp").type("Patient Bed");
    cy.get("#nameInp").should("have.value", "Patient Bed");

    cy.get("#locationInp").type("Room 200A");
    cy.get("#locationInp").should("have.value", "Room 200A");

    cy.get("#descriptionInp").type("This is a patient bed");
    cy.get("#descriptionInp").should("have.value", "This is a patient bed");

    cy.get("#uniqueIdentifierInp").type("abcdeg");
    cy.get("#uniqueIdentifierInp").should("have.value", "abcdeg");

    // field preservation
    cy.get("#backToSeleResTypeBtn").click();
    cy.get("#selectSpacesBtn").click();

    cy.get("#nameInp").should("have.value", "Patient Bed");
    cy.get("#locationInp").should("have.value", "Room 200A");
    cy.get("#descriptionInp").should("have.value", "This is a patient bed");
    cy.get("#uniqueIdentifierInp").should("have.value", "abcdeg");

    cy.get("#submitBtn").click();
  });
});

describe("Board Process", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/boardProcess");

    cy.contains("Process");
    cy.contains("Patient");

    cy.get("#boardProcessProcedures");

    // page switching
    cy.get("#chatBtn").click();
    cy.get("#boardProcessChat");

    cy.get("#proceduresBtn").click();
    cy.get("#boardProcessProcedures");

    cy.get("#processDetailsBtn").click();
    cy.url().should("include", "/processDetails");
  });
});

describe("Process Details", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/processDetails");

    cy.contains("Process");
    cy.contains("Patient");
    cy.contains("Current Procedure");
    cy.contains("Completed Procedures");
    cy.contains("Total Procedures");
    cy.contains("PROCESS ID");
  });
});

describe("Notification Box", () => {
  it("loading and navigating", () => {
    cy.visit("http://localhost:3000/notifications");
    cy.contains("My Notifications");
  });
});
