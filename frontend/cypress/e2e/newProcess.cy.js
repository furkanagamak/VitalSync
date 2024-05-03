/*describe('Process Template List Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/modifyProcess/activeProcesses');
        cy.get('button').contains('Start New Process').click();
    });

    it('successfully loads the process template management page', () => {
        cy.contains('Create from Existing or New Template').should('be.visible');
        cy.contains('Create Instance from New Template').should('be.visible');
        cy.contains('Name').should('be.visible');
        cy.contains('Actions').should('be.visible');
    });

    /*it('navigates to create template form', () => {
        cy.get('button').contains('Create New Template').click();
        cy.url().should('include', '/processTemplateForm');
      });*/
/*});
*/
/*describe('Add Section Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/modifyProcess/addSection');
    });

    it('successfully loads the Add Section page', () => {
        cy.contains('Add New Section').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Add Section').should('be.visible');
    });

    it('shows notification on successful section addition', () => {
        cy.get('button').contains('Add Section').click();
        cy.contains('Section Added!').should('be.visible');
    });

});*/

/*describe('Patient Information Form Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/newProcess/patientForm');
    });

    it('successfully loads the Patient Information form', () => {
        cy.contains('Patient Information').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.get('input[id="fullName"]').should('be.visible');
        cy.get('input[id="address"]').should('be.visible');
        cy.get('input[id="em1p"]').should('be.visible');
        cy.get('input[id="em2r"]').should('be.visible');
    });

    it('navigates back to process templates on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/processManagement/newProcess/processTemplates');
    });

    it('navigates to pending staff assignments on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/processManagement/newProcess/pendingStaffAssignments');
    });
});*/

/*describe('New Process Pending Resources Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/newProcess/pendingResourceAssignments');
    });

    it('successfully loads Pending Resources page for new process', () => {
        cy.contains('Pending Resource Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.contains('Assign necessary resources to all procedures:').should('be.visible');
    });

    it('navigates back to pending staff assignments on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/processManagement/newProcess/pendingStaffAssignments');
    });

    it('navigates to review staff assignments on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/processManagement/newProcess/reviewStaffAssignments');
    });

    it('opens resource assignment for a procedure needing assignments', () => {
        cy.contains('Assignments Required').click();
        cy.url().should('include', '/processManagement/newProcess/resourceAssignments');
    });

    it('executes auto-assign functionality', () => {
        cy.get('button').contains('Auto-Assign All').click();
    });
});*/

/*describe('New Process Pending Staff Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/newProcess/pendingStaffAssignments');
    });

    it('successfully loads Pending Staff Assignments page for new process', () => {
        cy.contains('Pending Staff Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.contains('Assign necessary staff to all procedures:').should('be.visible');
    });

    it('navigates back to patient information form on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/processManagement/newProcess/patientForm');
    });

    it('navigates to pending resource assignments on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/processManagement/newProcess/pendingResourceAssignments');
    });

    it('opens staff assignment for a procedure needing assignments', () => {
        cy.contains('Assignments Required').click();
        cy.url().should('include', '/processManagement/newProcess/staffAssignments');
    });
});*/

/*describe('New Process Create Review Staff Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/newProcess/reviewStaffAssignments');
    });

    it('successfully loads Create Review Staff Assignments page for new process', () => {
        cy.contains('Review Staff Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.contains('Confirm the following staff assignments for procedures in all sections:').should('be.visible');
    });

    it('navigates back to pending resource assignments on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/processManagement/newProcess/pendingResourceAssignments');
    });
});*/

/*describe('New Process Create Review Resource Assignments Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/newProcess/reviewResourceAssignments');
    });

    it('successfully loads Create Review Resource Assignments page for new process', () => {
        cy.contains('Review Resource Assignments').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Proceed').should('be.visible');
        cy.contains('Confirm the following resource assignments for procedures in all sections:').should('be.visible');
    });

    it('navigates back to review staff assignments on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/processManagement/newProcess/reviewStaffAssignments');
    });

    it('navigates to the preview on Proceed', () => {
        cy.get('button').contains('Proceed').click();
        cy.url().should('include', '/processManagement/newProcess/preview');
    });

});*/

/*describe('New Process Preview Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('#emailInput').type('john.doe@example.com');
        cy.get('#passwordInput').type('password123');
        cy.get('button').contains('Sign in').click();
        cy.wait(1000);
        cy.visit('/processManagement/newProcess/preview');
    });

    it('successfully loads Preview page for new process', () => {
        cy.contains('Process Preview').should('be.visible');
        cy.contains('Go Back').should('be.visible');
        cy.contains('Confirm').should('be.visible');
    });

    it('displays correct process, patient, and procedures information', () => {
        cy.contains('Process:').should('be.visible');
        cy.contains('Patient:').should('be.visible');
        cy.contains('Procedures:').should('be.visible');

    });

    it('navigates back to review resource assignments on Go Back', () => {
        cy.get('button').contains('Go Back').click();
        cy.url().should('include', '/processManagement/newProcess/reviewResourceAssignments');
    });

    it('navigates to process management home on Confirm', () => {
        cy.get('button').contains('Confirm').click();
        cy.url().should('include', '/activeProcesses');
    });

});*/



