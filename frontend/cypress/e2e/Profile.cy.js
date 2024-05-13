describe("MyComponent Button Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#emailInput").type("john.doe@example.com");
    cy.get("#passwordInput").type("password123");
    cy.get("button").contains("Sign in").click();
    cy.get("#userNav").should("be.visible").click();
  });

  it("returns to profile view from ChangeAvailability", () => {
    cy.contains("Edit Schedule").should("be.visible").click();
    cy.contains("Weekly Schedule Update").should("be.visible");
    cy.contains("Back to Profile").click();
    cy.contains("Change Availability").should("not.exist");
  });

  it("profile information changes", () => {
    cy.contains("Edit Profile").click();
    cy.contains("Save Changes").click();
  });

  describe("Contact Information Editing", () => {
    it("should display errors when all fields are cleared and save is attempted", () => {
      cy.contains("Edit Contact Info").click();
      cy.get("#cellNo").clear();
      cy.get("#officeNo").clear();
      cy.get("#email").clear();
      cy.get("#office").clear();

      cy.contains("Save Changes").click();

      // Check for error messages.
      cy.contains("Invalid phone number format. Required: XXX-XXX-XXXX").should(
        "exist"
      );
      cy.contains("Invalid email format.").should("exist");
    });
  });

  describe("Contact Information Editing", () => {
    it("should accept and retain valid input data when Save Changes is clicked", () => {
      cy.contains("Edit Contact Info").click();

      // Input valid data into each field
      cy.get("#cellNo").clear().type("123-456-7890");
      cy.get("#officeNo").clear().type("098-765-4321");
      cy.get("#email").clear().type("john.doe@example.com");
      cy.get("#office").clear().type("Room 101");

      // Submit
      cy.contains("Save Changes").click();

      // Check that the fields contain the correct values
      cy.contains("123-456-7890").should("exist");
      cy.contains("098-765-4321").should("exist");
      cy.contains("john.doe@example.com").should("exist");
      cy.contains("Room 101").should("exist");

      cy.contains("Invalid phone number format. Required: XXX-XXX-XXXX").should(
        "not.exist"
      );
      cy.contains("Invalid email format.").should("not.exist");
    });
  });

  describe("Profile Editing and Verification", () => {
    it("should correctly update and verify profile information", () => {
      cy.contains("Edit Profile").click();

      // Enter information
      cy.get("#name").clear().type("James Doe");
      cy.get("#designation").clear().type("TS");
      cy.get("#specialty").clear().type("Test");
      cy.get("#department").clear().type("Testing");

      // Submit the changes
      cy.contains("Save Changes").click();

      // Verify that information is on the screen
      cy.contains("James Doe").should("exist");
      cy.contains("TS").should("exist");
      cy.contains("Test").should("exist");
      cy.contains("Testing").should("exist");

      // Edit the profile again
      cy.contains("Edit Profile").click();

      // Change the information to before
      cy.get("#name").clear().type("John Doe");
      cy.get("#designation").clear().type("MD");
      cy.get("#specialty").clear().type("Doctor");
      cy.get("#department").clear().type("Cardiology");

      // Save the changes, no need to verify
      cy.contains("Save Changes").click();
    });
  });

  describe("Password Reset Functionality", () => {
    it("should handle password confirmation and reset", () => {
      //reset password
      cy.contains("Reset Password").click();

      cy.get("#currentPassword").type("password123");
      cy.contains("Confirm").click();

      cy.get("#newPassword").clear().type("password12");
      cy.get("#ConfirmNewPassword").clear().type("password12");
      cy.get("#resetConfirm").click();

      cy.contains("Password has been successfully reset.").should("be.visible");

      //reset password back to original
      cy.contains("Reset Password").click();

      cy.get("#currentPassword").type("password12");
      cy.contains("Confirm").click();

      cy.get("#newPassword").clear().type("password123");
      cy.get("#ConfirmNewPassword").clear().type("password123");
      cy.get("#resetConfirm").click();
      cy.wait(1000);
    });
  });

  describe("Profile Image Upload", () => {
    it("allows the user to upload a new profile image", () => {
      const imagePath = "doctorProfile.jpg";
      cy.contains("Change Profile Image").click();
      cy.contains("Choose File").click();
      cy.get('input[type="file"]').attachFile(imagePath); // Use the attachFile command
      cy.get("#imageupload").click();
      cy.contains("Your profile image has been updated!").should("be.visible");
    });
  });

  describe("Edit Eligible Roles interaction", () => {
    it("checks all roles, saves changes, and verifies all remain checked", () => {
      // logout and login as user who is not assigned to any procedure
      cy.get("#logoutbtn").click();
      cy.get("#emailInput").type("dummy@example.com");
      cy.get("#passwordInput").type("password123");
      cy.get("button").contains("Sign in").click();
      cy.get("#userNav").should("be.visible").click();

      // Click the "Edit Eligible Roles" button
      cy.contains("Edit Eligible Roles").click();

      //  all checkboxes
      cy.get('input[type="checkbox"]')
        .should("be.visible")
        .each(($el) => {
          cy.wrap($el).check();
        });

      // Click "Save Changes" button
      cy.contains("Save Changes").click();

      cy.contains("Roles successfully updated.").should("be.visible");

      // Re-open the Edit roles modal to verify
      cy.contains("Edit Eligible Roles").click();

      // Verify that all checkboxes remain checked
      cy.get('input[type="checkbox"]').should("be.checked");
    });
  });

  describe("Edit Schedule functionality", () => {
    it("edits the schedule and verifies the changes", () => {
      //Click "Edit Schedule"
      cy.contains("Edit Schedule").click();
      cy.contains("p", "Sunday") // Repeat finding 'Monday' to ensure our scope is correct for checking
        .closest("div.grid")
        .closest("div.grid")
        .within(() => {
          cy.get('input[type="time"]')
            .first()
            .then((input) => {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
              ).set;
              nativeInputValueSetter.call(input[0], "08:00");
              input[0].dispatchEvent(new Event("input", { bubbles: true }));
              input[0].dispatchEvent(new Event("change", { bubbles: true }));
            });

          cy.get('input[type="time"]')
            .last()
            .then((input) => {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
              ).set;
              nativeInputValueSetter.call(input[0], "16:00");
              input[0].dispatchEvent(new Event("input", { bubbles: true }));
              input[0].dispatchEvent(new Event("change", { bubbles: true }));
            });
        });

      cy.contains("Update Schedule").click();
      cy.contains("Edit Schedule").click();

      cy.contains("p", "Sunday")
        .closest("div.grid")
        .closest("div.grid")
        .within(() => {
          cy.get('input[type="time"]').first().should("have.value", "08:00");
          cy.get('input[type="time"]').last().should("have.value", "16:00");
        });

      //Check "Day Off" for Sunday
      cy.contains("p", "Sunday")
        .closest("div.grid")
        .closest("div.grid")
        .within(() => {
          cy.get('input[type="checkbox"]').click();
        });

      cy.contains("Update Schedule").click();
      cy.contains("Edit Schedule").click();

      cy.contains("p", "Sunday")
        .closest("div.grid")
        .closest("div.grid")
        .within(() => {
          cy.get('input[type="checkbox"]').should("be.checked");
        });
    });
  });
});
