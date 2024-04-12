describe("Resource Create", () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#emailInput').type('john.doe@example.com');
    cy.get('#passwordInput').type('password123');
    cy.get('button').contains('Sign in').click();
    cy.wait(1000);
    cy.visit('/resources');
});
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
