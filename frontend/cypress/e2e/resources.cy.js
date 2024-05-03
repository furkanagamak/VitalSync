describe("Resource view and create tests", () => {
  //Resource View and Interaction Tests
  describe("Resource View and Interaction Tests", () => {
    beforeEach(() => {
      cy.visit("/");
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

  // Resource modify tests
  describe("Resource modify", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get("#emailInput").type("john.doe@example.com");
      cy.get("#passwordInput").type("password123");
      cy.get("button").contains("Sign in").click();
      cy.wait(1000);
      cy.visit("http://localhost:3000/resources");
    });

    it("loading and navigation", () => {
      cy.get(`#editResource-TR-102`).click();

      // header
      cy.contains("Edit Resource");
      cy.get("#navBackToViewResourceBtn").click();
      cy.get(`#editResource-TR-102`).click();

      // fields are prefilled with corresponding values
      cy.get("#editResourceNameElem").should("have.value", "test room");
      cy.get("#editResourceLocationElem").should("have.value", "TRoom 102");
      cy.get("#editResourceDescripElem").should("have.value", "");
    });

    it("updating valid fields", () => {
      cy.get(`#editResource-TR-102`).click();

      // update location field
      cy.get("#editResourceLocationElem").clear().type("TRoom 105C");
      cy.get("#editResourceDescripElem").type(
        "Description for edited resource!"
      );

      // submit
      cy.get("#editResourceSubmitBtn").click();
      cy.contains("The resource has been updated!");

      // home view should be updated
      cy.get('input[placeholder="Search for the resource here ..."]').type(
        "TR-102"
      );
      cy.contains("Description for edited resource!");
    });

    it("updating invalid fields", () => {
      cy.get(`#editResource-TR-102`).click();

      // update location field
      cy.get("#editResourceLocationElem").clear().type("TRoom 105C");
      cy.get("#editResourceDescripElem").clear();

      // submit
      cy.get("#editResourceSubmitBtn").click();
      cy.contains(
        "For non-roles resources, a location and description must be defined!"
      );
    });
  });

  // Resource delete tests
  // describe("Resource delete", () => {
  //   beforeEach(() => {
  //     cy.visit("/");
  //     cy.get("#emailInput").type("john.doe@example.com");
  //     cy.get("#passwordInput").type("password123");
  //     cy.get("button").contains("Sign in").click();
  //     cy.wait(1000);
  //     cy.visit("http://localhost:3000/resources");
  //   });

  //   it("load and navigating", () => {
  //     cy.get("#deleteResource-TR-102").click();

  //     // modal display
  //     cy.contains("Are you sure you want to delete:");
  //     cy.contains("test room");
  //     cy.contains("Unique ID: TR-102");
  //     cy.contains("Yes");
  //     cy.contains("Cancel").click();

  //     // exit modal
  //     cy.contains("Are you sure you want to delete:").should("not.exist");
  //   });

  //   it("attempt to remove resources or roles that is in action should fail", () => {
  //     // attempts to delete in action resource
  //     cy.get("#deleteResource-TR-102").click();
  //     cy.contains("Yes").click();
  //     cy.contains(
  //       "The resource you are trying to delete is assigned to one or more procedure templates!"
  //     );
  //     cy.contains("Cancel").click();

  //     // attempts to delete assigned roles
  //     cy.get('input[placeholder="Search for the resource here ..."]').type(
  //       "test_physician"
  //     );
  //     cy.get("#deleteResource-test_physician").click();
  //     cy.contains("Yes").click();
  //     cy.contains(
  //       "The role you are trying to delete is assigned to one or more accounts!"
  //     );
  //   });

  //   it("removing resources and role that is not in action should succeed", () => {
  //     // remove resource
  //     cy.get("#deleteResource-AR-102").click();
  //     cy.contains("Yes").click();
  //     cy.contains("The resource has been delete!");

  //     // remove role
  //     cy.get('input[placeholder="Search for the resource here ..."]').type(
  //       "physician"
  //     );
  //     cy.get("#deleteResource-physician").click();
  //     cy.contains("Yes").click();
  //     cy.contains("The role has been delete!");
  //   });
  // });

  // Resource Create Tests
  describe("Resource Create Tests", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get("#emailInput").type("john.doe@example.com");
      cy.get("#passwordInput").type("password123");
      cy.get("button").contains("Sign in").click();
      cy.wait(1000);
      cy.visit("http://localhost:3000/resources/create");
    });

    it("loading and navigating", () => {
      cy.contains("Equipment");
      cy.contains("Role");
      cy.contains("Spaces");
    });

    it("form flow", () => {
      // select tests
      cy.get("#selectEquipmentsBtn").click();
      cy.contains("Equipment");
      cy.get("#backToSeleResTypeBtn").click();

      cy.get("#selectRoleBtn").click();
      cy.contains("Role");
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

      // field preservation
      cy.get("#backToSeleResTypeBtn").click();
      cy.get("#selectSpacesBtn").click();

      cy.get("#nameInp").should("have.value", "Patient Bed");
      cy.get("#locationInp").should("have.value", "Room 200A");
      cy.get("#descriptionInp").should("have.value", "This is a patient bed");

      cy.get("#submitBtn").click();

      cy.contains("The resource has been successfully created!");
    });

    it("create test equipment", () => {
      cy.get("#selectEquipmentsBtn").click();
      cy.contains("Equipment");

      // form insertions
      cy.get("#nameInp").type("Syringe");
      cy.get("#nameInp").should("have.value", "Syringe");

      cy.get("#locationInp").type("Room 200A");
      cy.get("#locationInp").should("have.value", "Room 200A");

      cy.get("#descriptionInp").type("This is a syringe");
      cy.get("#descriptionInp").should("have.value", "This is a syringe");

      cy.get("#submitBtn").click();

      cy.contains("The resource has been successfully created!");
    });

    it("create role", () => {
      cy.get("#selectRoleBtn").click();
      cy.contains("Roles");

      cy.get("#nameInp").type("Administrators");
      cy.get("#nameInp").should("have.value", "Administrators");

      cy.get("#descriptionInp").type("This is a admin");
      cy.get("#descriptionInp").should("have.value", "This is a admin");

      cy.get("#submitBtn").click();

      cy.contains("The newly requested role is created!");
    });
  });
});
