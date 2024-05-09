describe('Process Template List Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/modifyProcess/activeProcesses');
        cy.get('button').contains('Start New Process').click();
    });

    it('is able to create a new process', () => {
        cy.get('.modify-process-template-button').first().click();
        cy.get("button").contains("Add Section").click();
    cy.url().should("include", "/AddSectionForm");

    cy.get("#name").type("Test Section");
    cy.get("#name").should("have.value", "Test Section");
    cy.get("#description").type("Test Section Description");
    cy.get("#description").should("have.value", "Test Section Description");

    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.get('button[title="Move Down"]').first().click();
    cy.get('button[title="Move Up"]').first().click();
    cy.get('button[title="Delete"]').first().click();

    cy.get("#procedure-name").type("Procedure");
    cy.get(".MuiAutocomplete-popper").should("be.visible");
    cy.contains("ProcedureName").click();
    cy.contains("Add Procedure").click();
    cy.contains("Save Section").click();

    cy.contains("Section Added!").should("be.visible");
        cy.get('button').contains('Use Template').click();

        cy.get('[name="firstName"]').type('James');
        cy.get('[name="lastName"]').type('Johnson');
        cy.get('[name="lastName"]').type('Johnson');
        cy.get('button[aria-label="Choose date"]').click();
        cy.contains('button', '15').click();
        cy.get('[name="sex"]').type('male');
        cy.get('.phoneInput1').type('5162634416');
        cy.get('[name="street"]').type('123 lane');
        cy.get('[name="city"]').type('london');
        cy.get('#state-selection')
  .parent()
  .click()
  .get('ul > li[data-value="NY"]')
  .click();
          cy.get('[name="zip"]').type('11554');
          cy.get('[name="emergencyContact1Name"]').type('Sarah Smith');
        cy.get('[name="emergencyContact1Relation"]').type('Sister');
        cy.get('.phoneInput2').type('9876543210'); 
        cy.get('[name="emergencyContact2Name"]').type('Robert Brown');
        cy.get('[name="emergencyContact2Relation"]').type('Friend');
        cy.get('.phoneInput3').type('1234567890'); 
        cy.get('[name="insuranceProvider"]').type('HealthCare Inc.');
        cy.get('[name="insuranceGroup"]').type('HG6723');
        cy.get('[name="insurancePolicy"]').type('P9876543');
        cy.get('[name="knownConditions"]').type('Asthma, Diabetes');
        cy.get('[name="allergies"]').type('Peanuts, Shellfish');
        cy.get('button').contains('Proceed').click({force: true});

        cy.get('button[aria-label*="Choose date"]').click();
        cy.contains('button', '28').click();  
        cy.get('button[aria-label*="Choose time"]').click({force:true});
        cy.get('li[aria-label*="9 hours"]').click({force:true});
        cy.get('li[aria-label*="AM"]').click({force:true});
        cy.contains('button', 'OK').click();

        cy.get('button').contains('Proceed').click({force: true});

        cy.get('button').contains('Assignments Required').each(($btn, index, $list) => {
            cy.wrap($btn).click();
            cy.get('button').contains('Auto').click();
            cy.get('button').contains('Save').click();

        });
        cy.get('button').contains('Proceed').click({force: true});
        cy.get('button').contains('Proceed').click({force: true});

       /* cy.get('button').contains('Assignments Required').each(($btn, index, $list) => {
            cy.wrap($btn).click();
            cy.get('button').contains('Auto').click();
            cy.get('button').contains('Save').click();

        });
        cy.get('button').contains('Proceed').click({force: true});
        cy.get('button').contains('Proceed').click({force: true});
        cy.get('button').contains('Confirm').click();
        cy.contains('Process successfully created!').should('be.visible');*/

    });
});

