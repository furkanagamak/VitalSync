

describe('MyComponent Button Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#emailInput').type('john.doe@example.com');
    cy.get('#passwordInput').type('password123');
    cy.get('button').contains('Sign in').click();
    cy.wait(1000);
    cy.get('#userNav').should('be.visible').click();
  });
  

    it('changes view to ChangeAvailability on clicking Edit Schedule', () => {
      cy.contains('Edit Schedule').should('exist').click();
      cy.contains('Time-Off Request').should('be.visible');
    });
  
    it('returns to profile view from ChangeAvailability', () => {
      cy.contains('Edit Schedule').should('be.visible').click();
      cy.contains('Weekly Schedule Update').should('be.visible');
      cy.contains('Back to Profile').click();
      cy.contains('Change Availability').should('not.exist');
    });

    it('returns to profile view from ChangeAvailability', () => {
      cy.contains('Edit Schedule').should('be.visible').click();
      cy.contains('Weekly Schedule Update').should('be.visible');
      cy.contains('Submit').click();
      cy.contains('Change Availability').should('not.exist');
    });

    it('returns to profile view from ChangeAvailability', () => {
      cy.contains('Edit Schedule').should('be.visible').click();
      cy.contains('Weekly Schedule Update').should('be.visible');
      cy.contains('Update').click();
      cy.contains('Change Availability').should('not.exist');
    });


    it('profile information changes', () => {
        cy.contains('Edit Profile').click();
        cy.contains('Save Changes').click();
      });

      describe('Contact Information Editing', () => {
        it('should display errors when all fields are cleared and save is attempted', () => {
          cy.contains('Edit Contact Info').click();
          cy.get('#cellNo').clear();
          cy.get('#officeNo').clear(); 
          cy.get('#email').clear(); 
          cy.get('#office').clear();
      

          cy.contains('Save Changes').click();
      
          // Check for error messages. 
          cy.contains('Invalid phone number format. Required: XXX-XXX-XXXX').should('exist');
          cy.contains('Invalid email format.').should('exist');
        });
      });

      describe('Contact Information Editing', () => {
        it('should accept and retain valid input data when Save Changes is clicked', () => {
          cy.contains('Edit Contact Info').click(); 
      
          // Input valid data into each field
          cy.get('#cellNo').clear().type('123-456-7890');
          cy.get('#officeNo').clear().type('098-765-4321');
          cy.get('#email').clear().type('john.doe@example.com');
          cy.get('#office').clear().type('Room 101');
      
          // Submit
          cy.contains('Save Changes').click();
      
          // Check that the fields contain the correct values
          cy.contains('123-456-7890').should('exist');
          cy.contains('098-765-4321').should('exist');
          cy.contains('john.doe@example.com').should('exist');
          cy.contains('Room 101').should('exist');
      

          cy.contains('Invalid phone number format. Required: XXX-XXX-XXXX').should('not.exist');
          cy.contains('Invalid email format.').should('not.exist');
        });
      });
      

      describe('Profile Editing and Verification', () => {
        it('should correctly update and verify profile information', () => {

        
          cy.contains('Edit Profile').click();
      
          // Enter information
          cy.get('#name').clear().type('James Doe');
          cy.get('#designation').clear().type('TS');
          cy.get('#specialty').clear().type('Test');
          cy.get('#department').clear().type('Testing');
      
          // Submit the changes
          cy.contains('Save Changes').click();
      
          // Verify that information is on the screen
          cy.contains('James Doe').should('exist');
          cy.contains('TS').should('exist');
          cy.contains('Test').should('exist');
          cy.contains('Testing').should('exist');
      
          // Edit the profile again 
          cy.contains('Edit Profile').click();
      
          // Change the information to before
          cy.get('#name').clear().type('John Doe');
          cy.get('#designation').clear().type('MD');
          cy.get('#specialty').clear().type('Doctor');
          cy.get('#department').clear().type('Cardiology');
      
          // Save the changes, no need to verify
          cy.contains('Save Changes').click();
        });
      });
      
      describe('Password Reset Functionality', () => {
        it('should return approprate errors when entering wrong values when resetting the password', () => {      

          cy.contains('Reset Password').click();
      
          //Enter the current password for confirmation
          cy.get('#currentPassword').type('password123'); //Enter Current Password
          cy.contains('Confirm').click();
      
      
          //Enter a new password and confirm, pursoefully entering wrong password
          cy.get('#newPassword').clear().type('password123');
          cy.get('#ConfirmNewPassword').clear().type('password123');
          cy.get('#resetConfirm').click(); 
      
          // Check for toast error messages Entered old password         
          cy.contains('New password must be different from the old password.').should('be.visible');

          cy.get('#newPassword').clear().type('password123');
          cy.get('#ConfirmNewPassword').clear()
          cy.get('#resetConfirm').click(); 

          // Check for toast error messages Entered mismatching passwords
          cy.contains('Passwords do not match').should('be.visible');
        });
      });

      describe('Password Reset Functionality', () => {
        it('should handle password confirmation and reset', () => {

          //reset password
          cy.contains('Reset Password').click();

          cy.get('#currentPassword').type('password123'); 
          cy.contains('Confirm').click();

          cy.get('#newPassword').clear().type('password12');
          cy.get('#ConfirmNewPassword').clear().type('password12');
          cy.get('#resetConfirm').click(); 

          cy.contains('Password has been successfully reset.').should('be.visible');
      
          //reset password back to original
          cy.contains('Reset Password').click();

          cy.get('#currentPassword').type('password12'); 
          cy.contains('Confirm').click(); 

          cy.get('#newPassword').clear().type('password123');
          cy.get('#ConfirmNewPassword').clear().type('password123');
          cy.get('#resetConfirm').click(); 
        });
      });
      
      
    it('successfully completes the reset password flow', () => {
      cy.contains('Reset Password').click();
      cy.get('.ConfirmResetPasswordModal').should('be.visible');
      cy.contains('Confirm').click();
      cy.contains('Cancel').click();
      cy.get('.ConfirmResetPasswordModal').should('not.exist');
    });
      

    it('opens the image uploader and clicks upload', () => {
      cy.contains('Change Profile Image').click();
      cy.contains('Upload').click();
    });

      /*it('opens termination modal on clicking Terminate Account button', () => {
        cy.contains('Terminate Account').click();
        cy.contains('Are you sure you want to terminate this account?').should('be.visible');
      });*/

      /*
      it('closes termination modal on submitting termination', () => {
        cy.contains('Terminate Account').click();
        cy.get('input[type="text"]').type('john smith');
        cy.contains('Submit').click();
        cy.contains('Account has been Terminated').should('exist');
      });
      
      describe('Profile Image Upload', () => {
        it('allows the user to upload a new profile image', () => {
          const imagePath = 'doctorProfile.jpg';
          cy.contains('Change Profile Image').click(); 
          cy.contains('Choose File').click();
          cy.get('input[type="file"]').attachFile(imagePath); // Use the attachFile command 
          cy.get('#imageupload').click();
          cy.contains('Your profile image has been updated!').should('be.visible');
        });
      });*/



describe('Edit Eligible Roles interaction', () => {
  it('checks all roles, saves changes, and verifies all remain checked', () => {
    // Click the "Edit Eligible Roles" button
    cy.contains('Edit Eligible Roles').click();

    //  all checkboxes
    cy.get('input[type="checkbox"]').should('be.visible').each(($el) => {
      cy.wrap($el).check(); 
    });

    // Click "Save Changes" button
    cy.contains('Save Changes').click(); 

    cy.contains('Roles updated successfully.').should('be.visible');

    // Re-open the Edit roles modal to verify
    cy.contains('Edit Eligible Roles').click();

    // Verify that all checkboxes remain checked
    cy.get('input[type="checkbox"]').should('be.checked');
  });
});

describe('Edit Schedule functionality', () => {

  it('edits the schedule and verifies the changes', () => {
    //Click "Edit Schedule"
    cy.contains('Edit Schedule').click();

    //Check "Day Off" for Sunday
    cy.contains('div', 'Sunday').within(() => {
      cy.get('input[type="checkbox"]').check();
    });

    //Set Monday start time to 8:00 AM and end time to 4:00 PM
    cy.contains('div', 'Monday').within(() => {
      cy.get('input[type="time"]').first().then(input => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input[0], '08:00');
        input[0].dispatchEvent(new Event('input', { bubbles: true }));
        input[0].dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      cy.get('input[type="time"]').last().then(input => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input[0], '16:00');
        input[0].dispatchEvent(new Event('input', { bubbles: true }));
        input[0].dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    // Click "Update Schedule"
    cy.contains('Update Schedule').click();

    // Check for a confirmation message
    cy.contains('Weekly schedule updated successfully!').should('be.visible');

    //Click "Edit Schedule" again
    cy.contains('Edit Schedule').click();

    //Verify Sunday is a day off
    cy.contains('div', 'Sunday').within(() => {
      cy.get('input[type="checkbox"]').should('be.checked');
    });

    // Verify Monday times are set correctly
    cy.contains('div', 'Monday').within(() => {
      cy.get('input[type="time"]').first().should('have.value', '08:00');
      cy.get('input[type="time"]').last().should('have.value', '16:00');
    });
  });
});

  });
  