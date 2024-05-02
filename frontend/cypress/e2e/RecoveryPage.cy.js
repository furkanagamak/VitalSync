describe("Recovery Page Tests", () => {
  beforeEach(() => {
    cy.visit("/RecoveryPage");
    cy.wait(1000);
  });

  context("Step 1: Enter Email", () => {
    it("disables the submit button if the email is empty", () => {
      cy.get("button").contains("Submit").should("be.disabled");
    });

    it("disables the submit button if the email is invalid", () => {
      cy.get('input[type="email"]').type("invalidemail");
      cy.get("button").contains("Submit").should("be.disabled");
    });

    it("proceeds to the next step on valid email submission", () => {
      cy.intercept("POST", "/forgotPassword", { statusCode: 200 }).as(
        "forgotPasswordRequest"
      );
      cy.get('input[type="email"]').type("user@example.com");
      cy.get("button").contains("Submit").click();
      cy.wait("@forgotPasswordRequest");
      cy.contains("A code has been sent to your email.").should("be.visible");
    });
  });

  context("Step 2: Verify Code", () => {
    beforeEach(() => {
      cy.intercept("POST", "/forgotPassword", { statusCode: 200 });
      cy.get('input[type="email"]').type("user@example.com");
      cy.get("button").contains("Submit").click();
    });

    it("disables the submit button if the OTP code is empty", () => {
      cy.get("button").contains("Submit").should("be.disabled");
    });

    it("handles invalid or expired OTP code", () => {
      cy.intercept("POST", "/verifyOtp", {
        statusCode: 400,
        body: { message: "Invalid or expired OTP code." },
      });
      cy.get('input[type="text"]').type("123456");
      cy.get("button").contains("Submit").click();
      cy.contains("Invalid or expired OTP code.").should("be.visible");
    });

    it("proceeds to password reset on valid OTP code", () => {
      cy.intercept("POST", "/verifyOtp", { statusCode: 200 });
      cy.get('input[type="text"]').type("123456");
      cy.get("button").contains("Submit").click();
      cy.contains("New Password:").should("be.visible");
    });
  });

  context("Step 3: Reset Password", () => {
    beforeEach(() => {
      cy.intercept("POST", "/forgotPassword", { statusCode: 200 });
      cy.get('input[type="email"]').type("user@example.com");
      cy.get("button").contains("Submit").click();
      cy.intercept("POST", "/verifyOtp", { statusCode: 200 });
      cy.get('input[type="text"]').type("123456");
      cy.get("button").contains("Submit").click();
      cy.contains("New Password:").should("be.visible");
    });

    it("disables the submit button if passwords are empty", () => {
      cy.get("button").contains("Submit").should("be.disabled");
    });

    it("shows an error if passwords do not match", () => {
      cy.get('input[type="password"]').first().type("newpassword123");
      cy.get('input[type="password"]').last().type("newpassword");
      cy.get("button").contains("Submit").click();
      cy.contains("Passwords do not match.").should("be.visible");
    });

    it("completes the process for valid password entries", () => {
      cy.intercept("POST", "/resetPassword", { statusCode: 200 });
      cy.get('input[type="password"]').first().type("password123");
      cy.get('input[type="password"]').last().type("password123");
      cy.get("button").contains("Submit").click();
      cy.contains("Password has been successfully changed.").should(
        "be.visible"
      );
    });
  });
});
