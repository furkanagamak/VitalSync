

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
          // Assuming IDs are added to the inputs.
          cy.get('#cellNo').clear();
          cy.get('#officeNo').clear(); // Ensure #officeNo is set for the office number input
          cy.get('#email').clear(); // Ensure #email is set for the email input
          cy.get('#office').clear();
      
          // Click the "Save Changes" button. Assuming it has a unique class or ID.
          cy.contains('Save Changes').click();
      
          // Check for error messages. Assuming unique identifiers for error messages.
          cy.contains('Invalid phone number format. Required: XXX-XXX-XXXX').should('exist');
          cy.contains('Invalid email format.').should('exist');
        });
      });

      describe('Contact Information Editing', () => {
        it('should accept and retain valid input data when Save Changes is clicked', () => {
          cy.contains('Edit Contact Info').click(); // Opens the contact edit form
      
          // Input valid data into each field
          cy.get('#cellNo').clear().type('123-456-7890');
          cy.get('#officeNo').clear().type('098-765-4321');
          cy.get('#email').clear().type('john.doe@example.com');
          cy.get('#office').clear().type('Room 101');
      
          // Submit the changes
          cy.contains('Save Changes').click();
      
          // Check that the fields contain the correct values after submission
          cy.contains('123-456-7890').should('exist');
          cy.contains('098-765-4321').should('exist');
          cy.contains('john.doe@example.com').should('exist');
          cy.contains('Room 101').should('exist');
      
          // Optionally, you can verify that there are no error messages displayed
          cy.contains('Invalid phone number format. Required: XXX-XXX-XXXX').should('not.exist');
          cy.contains('Invalid email format.').should('not.exist');
        });
      });
      

      describe('Profile Editing and Verification', () => {
        it('should correctly update and verify profile information', () => {
          // Navigate to the appropriate page
          
          // Trigger edit mode to enter first set of data
          cy.contains('Edit Profile').click();
      
          // Enter first set of information
          cy.get('#name').clear().type('James Doe');
          cy.get('#designation').clear().type('TS');
          cy.get('#specialty').clear().type('Test');
          cy.get('#department').clear().type('Testing');
      
          // Submit the changes
          cy.contains('Save Changes').click();
      
          // Verify that new information is displayed on the screen
          cy.contains('James Doe').should('exist');
          cy.contains('TS').should('exist');
          cy.contains('Test').should('exist');
          cy.contains('Testing').should('exist');
      
          // Edit the profile again with new details
          cy.contains('Edit Profile').click();
      
          // Enter second set of information
          cy.get('#name').clear().type('John Doe');
          cy.get('#designation').clear().type('MD');
          cy.get('#specialty').clear().type('Doctor');
          cy.get('#department').clear().type('Cardiology');
      
          // Save the changes, no need to verify as per the instructions
          cy.contains('Save Changes').click();
        });
      });
      
      describe('Password Reset Functionality', () => {
        it('should return approprate errors when entering wrong values when resetting the password', () => {
          // Navigate to the page where the reset functionality is located
      
          // Trigger the password reset modal/dialog
          cy.contains('Reset Password').click();
      
          // Step 1: Enter the current password for confirmation
          cy.get('#currentPassword').type('password123'); // Adjust the password as necessary
          cy.contains('Confirm').click(); // Click the button to confirm the current password
      
          // Step 2: Handle response to current password entry, assuming a success scenario
          // (Add checks for failure scenarios if applicable)
      
          // Step 3: Enter a new password and confirm it
          cy.get('#newPassword').clear().type('password123');
          cy.get('#ConfirmNewPassword').clear().type('password123');
          cy.get('#resetConfirm').click(); // Button to confirm the password reset
      
          // Check for toast messages
          // Check for an error toast if the passwords do not meet the criteria
          
          cy.contains('New password must be different from the old password.').should('be.visible');

          cy.get('#newPassword').clear().type('password123');
          cy.get('#ConfirmNewPassword').clear()
          cy.get('#resetConfirm').click(); // Button to confirm the password reset

          cy.contains('Passwords do not match').should('be.visible');
      
          // Check for a success toast message after resetting the password correctly

        });
      });

      describe('Password Reset Functionality', () => {
        it('should handle password confirmation and reset with proper validations', () => {

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
      */
      describe('Profile Image Upload', () => {
      
        it('allows the user to upload a new profile image', () => {
          const imagePath = 'doctorProfile.jpg';
          cy.contains('Change Profile Image').click(); // Adjust selector to your modal open button
          cy.contains('Choose File').click();
          cy.get('input[type="file"]').attachFile(imagePath); // Use the attachFile command from the plugin
          cy.get('#imageupload').click();
          cy.contains('Your profile image has been updated!').should('be.visible');
        });
      });
  });
  