describe("Resource View and Interaction Tests", () => {
  beforeEach(() => {
    // Start by visiting the login page and logging in
    cy.visit('/login');  // Ensure you adjust this if your login route is different
    cy.get('#emailInput').type('john.doe@example.com');
    cy.get('#passwordInput').type('password123');
    cy.get('button').contains('Sign in').click();
    cy.wait(1000); // Adjust according to your application's response time
    cy.visit('/resources'); // Adjust if your resources page route is different
  });

  it("should load and display resources", () => {
    cy.contains("Resources");
    cy.get('table').should('exist');
  });

  it("should navigate to the create new resource page", () => {
    cy.get("#createNewResourceBtn").click();
    cy.url().should("include", "/resources/create");
  });

  it("should filter resources by type when selecting a filter", () => {
    // Ensure your filter buttons have data attributes or ids for easier selection
    cy.get('#EquipmentsFilter').click();

  });

  it("should filter resources by type when selecting a filter", () => {
    // Ensure your filter buttons have data attributes or ids for easier selection
    cy.get('#SpacesFilter').click();

  });

  it("should show roles when Personnel is selected", () => {
    cy.get('#PersonnelFilter').click();
  });

  it("should handle search functionality", () => {
    // Use the search bar to filter resources
    cy.get('input[placeholder="Search for the resource here ..."]').type('f');
  });

  // More tests can be added based on additional functionalities
});
