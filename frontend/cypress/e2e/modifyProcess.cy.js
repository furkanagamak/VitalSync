describe('Modify Process Landing Page Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/modifyProcess/landing');
    });

    it('successfully loads the Modify Process Landing page', () => {
        cy.contains('Process:').should('be.visible');
        cy.contains('Patient:').should('be.visible');
        cy.contains('Description').should('be.visible');
        cy.contains('Add Section').should('be.visible');
    });

    it('opens section details when clicking on a section name', () => {
        cy.get('button[id="openSection"]').first().click();
        cy.contains('Resource Assignments').should('be.visible');
        cy.contains('Staff Assignments').should('be.visible');
    });

    it('navigates to resource assignments page when clicking Resource Assignments button', () => {
        cy.get('button[id="openSection"]').first().click();
        cy.get('button').contains('Resource Assignments').click();
        cy.url().should('include', '/reviewResourceAssignments');
    });

    it('navigates to staff assignments page when clicking Staff Assignments button', () => {
        cy.get('button[id="openSection"]').first().click();
        cy.get('button').contains('Staff Assignments').click();
        cy.url().should('include', '/reviewStaffAssignments');
    });

    it('displays the deletion modal when clicking Delete Process', () => {
        cy.get('button').contains('Delete Process').click();
        cy.contains('delete').should('be.visible');
    });
});

describe('Modify Resource Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/modifyProcess/resourceAssignments');
    });

    it('successfully loads Modify Resource Assignments page', () => {
        cy.contains('- Modify Resource Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
    });

    it('navigates back to the landing page on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/modifyProcess/landing');
    });

    it('navigates to review resource assignments on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/modifyProcess/reviewResourceAssignments');
    });
});

describe('Modify Staff Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/modifyProcess/staffAssignments');
    });

    it('successfully loads Modify Staff Assignments page', () => {
        cy.contains('- Modify Staff Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
    });

    it('navigates back to the landing page on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/modifyProcess/landing');
    });

    it('navigates to review staff assignments on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/modifyProcess/reviewStaffAssignments');
    });
});


describe('Pending Staff Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/modifyProcess/pendingStaffAssignments');
    });

    it('successfully loads Pending Staff Assignments page', () => {
        cy.contains('Pending Staff Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.contains('Confirm the status of staff assignments for procedures in all sections:').should('be.visible');
    });

    it('navigates back to the landing page on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/modifyProcess/landing');
    });

    it('navigates to pending resource assignments on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/modifyProcess/pendingResourceAssignments');
    });

});

describe('Pending Resource Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/modifyProcess/pendingResourceAssignments');
    });

    it('successfully loads Pending Resource Assignments page', () => {
        cy.contains('Pending Resource Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.contains('Confirm the status of resource assignments for procedures in all sections:').should('be.visible');
    });

    it('navigates back to the staff assignments page on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/modifyProcess/pendingStaffAssignments');
    });

    it('navigates to the main modify process page on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/processManagement/');  //note that this saves changes of process
    });
});

describe('Review Staff Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/modifyProcess/reviewStaffAssignments');
    });

    it('successfully loads Review Staff Assignments page', () => {
        cy.contains('Review Staff Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.contains('Confirm the following staff assignments for procedures in all sections:').should('be.visible');
    });

    it('navigates back to the modify staff assignments page on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/modifyProcess/staffAssignments');
    });

    it('navigates to the landing page on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/landing');
    });
});


describe('Review Resource Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/processManagement/modifyProcess/reviewResourceAssignments');
    });

    it('successfully loads Review Resource Assignments page', () => {
        cy.contains('Review Resource Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.contains('Confirm the following resource assignments for procedures in all sections:').should('be.visible');
    });

    it('navigates back to the modify resource assignments page on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/modifyProcess/resourceAssignments');
    });

    it('navigates to the landing page on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/landing');
    });

});





