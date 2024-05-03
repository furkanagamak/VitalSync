describe("Resource View and Interaction Tests", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.wait(1000);
    cy.visit("/resources");
  });

  it("loading", () => {
    /* View Resource Page Headers */
    cy.contains("Resources");
    cy.get("#resourceSearchInpElem");
    cy.get("#createNewResourceBtn");

    /* filters */
    cy.get("#filterContainerElem");

    /* table */
    cy.get("table").should("exist");

    // page 1
    cy.contains("TR-102");
    cy.contains("UniqueIdentifier");
    cy.contains("AR-102");
    cy.contains("SR-222");
    cy.contains("TR-123");
    cy.contains("1 of 3");
    cy.get("#resourceTablePrevBtn").should("be.disabled");
    cy.get("#resourceTableNextBtn").should("not.be.disabled");
    cy.get("#resourceTableNextBtn").click();

    // page 2
    cy.contains("SR-333");
    cy.contains("LR-101");
    cy.contains("UniqueIdentifier");
    cy.contains("physician");
    cy.contains("nurse");
    cy.contains("2 of 3");
    cy.get("#resourceTablePrevBtn").should("not.be.disabled");
    cy.get("#resourceTableNextBtn").should("not.be.disabled");
    cy.get("#resourceTableNextBtn").click();

    // page 3
    cy.contains("surgeon");
    cy.contains("test_physician");
    cy.contains("test_nurse");
    cy.contains("3 of 3");
    cy.get("#resourceTablePrevBtn").should("not.be.disabled");
    cy.get("#resourceTableNextBtn").should("be.disabled");
  });

  it("should navigate to the create new resource page", () => {
    cy.get("#createNewResourceBtn").click();
    cy.url().should("include", "/resources/create");
  });

  it("should filter resources by type when selecting a filter", () => {
    // equipment filter applied
    cy.get("#EquipmentsFilter").click();
    cy.contains("No results found");

    // spaces filter applid
    cy.get("#SpacesFilter").click();
    cy.contains("TR-102");
    cy.contains("AR-102");
    cy.contains("SR-222");
    cy.contains("TR-123");
    cy.contains("SR-333");
    cy.contains("1 of 2");
    cy.get("#resourceTableNextBtn").click();
    cy.contains("LR-101");

    // personnel filter applid
    cy.get("#PersonnelFilter").click();
    cy.contains("UniqueIdentifier");
    cy.contains("physician");
    cy.contains("nurse");
    cy.contains("surgeon");
    cy.contains("test_physician");
    cy.contains("1 of 2");
    cy.get("#resourceTableNextBtn").click();
    cy.contains("test_nurse");
  });

  it("should handle search functionality", () => {
    // search by name
    cy.get('input[placeholder="Search for the resource here ..."]').type(
      "test room"
    );
    cy.contains("TR-102");
    cy.get('input[placeholder="Search for the resource here ..."]').clear();

    // search by description
    cy.get('input[placeholder="Search for the resource here ..."]').type(
      "testdescription"
    );
    cy.contains("test_physician");
    cy.contains("test_nurse");
    cy.get('input[placeholder="Search for the resource here ..."]').clear();

    // search by location
    cy.get('input[placeholder="Search for the resource here ..."]').type(
      "room 333"
    );
    cy.contains("SR-333");
    cy.get('input[placeholder="Search for the resource here ..."]').clear();

    // search by unique id
    cy.get('input[placeholder="Search for the resource here ..."]').type(
      "ar-102"
    );
    cy.contains("Room 102");
    cy.get('input[placeholder="Search for the resource here ..."]').clear();
  });
});
